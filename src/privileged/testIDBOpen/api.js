/* global IndexedDB, Services, ExtensionCommon, ExtensionUtils, ExtensionAPI, Cu */

ChromeUtils.defineModuleGetter(this, "IndexedDB", "resource://gre/modules/IndexedDB.jsm");
ChromeUtils.defineModuleGetter(this, "Services", "resource://gre/modules/Services.jsm");
ChromeUtils.defineModuleGetter(this, "ExtensionCommon", "resource://gre/modules/ExtensionCommon.jsm");
ChromeUtils.defineModuleGetter(this, "ExtensionUtils", "resource://gre/modules/ExtensionUtils.jsm");

// The userContextID reserved for the extension storage, it is defined and reserved as
// "userContextIdInternal.webextStorageLocal" in ContextualIdentityService.jsm.
// `-1 >>> 0` converts the signed number into an unsigned number (because userContextId is
// defined in the idl as an unsigned integer).
const WEBEXT_STORAGE_USER_CONTEXT_ID = -1 >>> 0;

function getTrimmedString(str) {
  if (str.length <= 80) {
    return str;
  }

  const length = str.length;

  return `${str.slice(0, 40)}...${str.slice(length - 37, length)}`;
}

this.testIDBOpen = class extends ExtensionAPI {
  /**
   * @param {object} context the addon context
   * @returns {object} api with study, studyDebug keys
   */
  getAPI(context) {
    const {extension} = this;
    const addonWidgetId = ExtensionCommon.makeWidgetId(extension.id);

    return {
      testIDBOpen: {
        async shouldEnroll() {
          const dataReporting = Services.prefs.getBoolPref("datareporting.policy.dataSubmissionEnabled", false);
          const testForceEnroll = Services.prefs.getBoolPref(`extensions.${addonWidgetId}.test.forceEnroll`, false);

          return dataReporting || testForceEnroll;
        },
        async run() {
          // Used in test to force the extension to defer to run the experiment API during some of the functional tests.
          const testWaitToRun = Services.prefs.getIntPref(`extensions.${addonWidgetId}.test.waitToRun`, 0);
          if (testWaitToRun > 0) {
            await ExtensionUtils.promiseTimeout(testWaitToRun);
          }

          // Create a storagePrincipal like the one we use for the storage.local IDB backend (which use
          // the same principal of the extension with the addition in the principal originAttributes
          // of the userContextId that we have reserved for the storage.local IDB backend).
          const storagePrincipal = Services.scriptSecurityManager.createCodebasePrincipal(
            extension.baseURI, {userContextId: WEBEXT_STORAGE_USER_CONTEXT_ID});

          try {
            await IndexedDB.openForPrincipal(storagePrincipal, "testIDBOpen", 1);
            return {success: true};
          } catch (err) {
            // DOMExpection is not directly avaiable as a global in an API module,
            // let's retrive it from the global related to Services and we pass .
            const {DOMException} = Cu.getGlobalForObject(Services);

            // For any Error instance that is not a DOMException, we will use "OtherError" as
            // a placeholder for it (same choice we made for the storage.local IDB data migration
            // telemetry events during the related telemetry data review).
            let errorName = "OtherError";

            if (err instanceof DOMException) {
              errorName = err.name.length > 80 ?
                getTrimmedString(err.name) : err.name;
            }

            return {success: false, errorName};
          }
        },
      },
    };
  }
};
