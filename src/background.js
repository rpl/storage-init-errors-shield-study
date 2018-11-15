/* global getStudySetup */

/**
 *  Goal: Implement an instrumented feature using `browser.study` API
 *
 *  Every runtime:
 *  - Prepare
 *
 *    - listen for `onEndStudy` (study endings)
 *    - listen for `study.onReady`
 *
 *  - Startup the feature
 *
 *    - attempt to `browser.study.setup` the study using our studySetup
 *
 *      - will fire EITHER
 *        -  `endStudy` (`expired`, `ineligible`)
 *        - onReady
 *      - (see docs for `browser.study.setup`)
 *
 *    - onReady: configure the feature to match the `variation` study selected
 *    - or, if we got an `onEndStudy` cleanup and uninstall.
 *
 *  During the feature:
 *    - `sendTelemetry` to send pings
 *    - `endStudy` to force an ending (for positive or negative reasons!)
 *
 *  Interesting things to try next:
 *  - `browser.study.validateJSON` your pings before sending
 *  - `endStudy` different endings in response to user action
 *  - force an override of setup.testing to choose branches.
 *
 */

class StudyLifeCycleHandler {
  /**
   * Listen to onEndStudy, onReady
   * `browser.study.setup` fires onReady OR onEndStudy
   *
   * call `this.enableFeature` to actually do the feature/experience/ui.
   */
  constructor() {
    /*
     * IMPORTANT:  Listen for `onEndStudy` before calling `browser.study.setup`
     * because:
     * - `setup` can end with 'ineligible' due to 'allowEnroll' key in first session.
     *
     */
    browser.study.onEndStudy.addListener(this.handleStudyEnding.bind(this));
    browser.study.onReady.addListener(this.enableFeature.bind(this));
  }

  /**
   *
   * side effects
   * - set up expiration alarms
   * - make feature/experience/ui with the particular variation for this user.
   *
   * @param {object} studyInfo browser.study.studyInfo object
   *
   * @returns {undefined}
   */
  async enableFeature(studyInfo) {
    await browser.study.logger.log(["Enabling experiment", studyInfo]);

    this._configureStudyExpiration(studyInfo);

    this._runIDBOpenTest();
  }

  /** handles `study:end` signals
   *
   * - opens 'ending' urls (surveys, for example)
   * - calls cleanup
   *
   * @param {object} ending An ending result
   *
   * @returns {undefined}
   */
  async handleStudyEnding(ending) {
    await browser.study.logger.log([`Study wants to end:`, ending]);

    // This study doesn't have any exit survey, and so there shouldn't be
    // any `ending.urls` to open using browser.tab.create, and there
    // shouldn't be any different actions to run based on `ending.endingName`.
    await browser.study.logger.log(`Studying ending name: ${ending.endingName}`);

    // Actually remove the addon.
    await browser.study.logger.log("About to actually uninstall");
    return browser.management.uninstallSelf();
  }

  // Internal helpers methods
  _configureStudyExpiration(studyInfo) {
    const { delayInMinutes } = studyInfo;
    if (delayInMinutes !== undefined) {
      const alarmName = `${browser.runtime.id}:studyExpiration`;
      const alarmListener = async alarm => {
        if (alarm.name === alarmName) {
          browser.alarms.onAlarm.removeListener(alarmListener);
          await browser.study.endStudy("expired");
        }
      };
      browser.alarms.onAlarm.addListener(alarmListener);
      browser.alarms.create(alarmName, {
        delayInMinutes,
      });
    }
  }

  async _runIDBOpenTest() {
    await browser.study.logger.log(["Running 'IndexedDB openForPrincipal' test"]);
    try {
      const {success, errorName} = await browser.testIDBOpen.run();
      await browser.study.logger.log(["Sending 'IndexedDB openForPrincipal' test results"]);
      if (success) {
        browser.study.sendTelemetry({
          event: "testIDBOpen",
          testResult: "success",
        });
      } else {
        browser.study.sendTelemetry({
          event: "testIDBOpen",
          testResult: "failure",
          // let's be 100% that errorName is going to be a string (as study.sendTelemetry would raise
          // an error otherwise).
          errorName: String(errorName),
        });
      }
    } catch (err) {
      // TODO: explicitly end the study here as "ineligible"?
      await browser.study.logger.log(["Error during 'IndexedDB openForPrincipal' test", err.message]);
      await browser.study.endStudy("ineligible");
    }
  }
}

/**
 * Run every startup to get config and instantiate the feature
 *
 * @returns {undefined}
 */
async function onEveryExtensionLoad() {
  new StudyLifeCycleHandler();

  const studySetup = await getStudySetup();
  await browser.study.logger.log(["Study setup: ", studySetup]);
  await browser.study.setup(studySetup);
}
onEveryExtensionLoad();
