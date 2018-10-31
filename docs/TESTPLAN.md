# Test plan for this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

- [Manual / QA TEST Instructions](#manual--qa-test-instructions)
  - [Preparations](#preparations)
  - [Download and install the shield addon study](#download-and-install-the-shield-addon-study)
- [Expected Functionality](#expected-functionality)
  - [Tests STRs](#tests-strs)
    - [Functionality test 1: "telemetry sent on users without any storage initialization issue"](#functionality-test-1-telemetry-sent-on-users-without-any-storage-initialization-issue)
    - [Functionality test 2: "telemetry sent on users with storage initialization issue"](#functionality-test-2-telemetry-sent-on-users-with-storage-initialization-issue)
    - [Elegibility test 1: "ineligible user on disabled telemetry"](#elegibility-test-1-ineligible-user-on-disabled-telemetry)
  - [QA Test plan](#qa-test-plan)
  - [Note: checking "sent Telemetry is correct"](#note-checking-sent-telemetry-is-correct)
- [Debug](#debug)
- [Peculiarities](#peculiarities)
  - [Find the extension storage directory](#find-the-extension-storage-directory)
  - [Manually force a Firefox profile into the "broken storage" status](#manually-force-a-firefox-profile-into-the-broken-storage-status)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Manual / QA TEST Instructions

### Preparations

- Download last Nightly and Beta versions of Firefox (NOTE: testing on Beta requires a signed shield addon study extension)
- Run Firefox instance and apply the neeeded about:config changes to the profile before enrolling in the study:
  - Navigate to _about:config_ and set the following preferences. (If a preference does not exist, create it be right-clicking in the white area and selecting New -> String)
  - Set `shieldStudy.logLevel` to `All`. This permits shield-add-on log output in browser console.
  - Set `extensions.storage-init-errors-shield-study_shield_mozilla_org.test.waitToRun` to `5000`.
    This prevent the addon to immediately run the test and uninstall itself, set it to the number of
    milliseconds you would like the addon to wait before completing the test (e.g. this allows to
    have the time to get the Extension UUID assigned to the addon from about:debugging before the
    extension uninstall itself)

### Download and install the shield addon study

- Open a Firefox instance and open an "about:config" tab to configure the following testing preferences:
  - to enable verbose logs on the shield addon:
    - `shieldStudy.logLevel`: `All`
- Install the latest reviewed add-on zip file temporarily from about:debugging
  (or install the last signed xpi about:addons)
- Go to [Bug 1502111](https://bugzilla.mozilla.org/show_bug.cgi?id=1502111) and download the latest reviewed addon file from the bug attachments

## Expected Functionality

This shield study doesn't present any UI or exit surveys to the user, and so the expected functionality has to be verified by
looking that the expected telemetry has been sent as expected, by looking at the logs collected in the browser console as described in
the following sub section: [Note: checking "sent Telemetry is correct"](#note-checking-sent-telemetry-is-correct).

### Tests STRs

#### Functionality test 1: "telemetry sent on users without any storage initialization issue"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- [Install the shield addon study](#download-and-install-the-shield-addon-study) section

**Expected behaviors**

- The following messages should have been logged in the Browser Console:

```
shield-study-utils: telemetry {"event":"testIDBOpen","testResult":"success"}
```

- The shield study addon has been uninstalled once the study ended
- Once the shield study addon has been removed, the storage directory for the extension has been removed from the Firefox profile dir (See section ["Find the extension storage directory"](#find-the-extension-storage-directory)).

#### Functionality test 2: "telemetry sent on users with storage initialization issue"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- [Manually force a Firefox profile into the "broken storage" status](#manually-force-a-firefox-profile-into-the-broken-storage-status)
- [Install the shield addon study](#download-and-install-the-shield-addon-study) section

**Expected behaviors**

- The following messages should have been logged in the Browser Console:

```
storage-init-errors-shield-study_shield_mozilla_org: Array [ "Running 'IndexedDB openForPrincipal' test" ]

Quota Something (FAKE_BROKEN_STORAGE) in the directory that doesn't belong!: ActorsParent.cpp:4252

IndexedDB UnknownErr: ActorsParent.cpp:605

storage-init-errors-shield-study_shield_mozilla_org: Array [ "Sending 'IndexedDB openForPrincipal' test results" ]

telemetry {"event":"testIDBOpen","testResult":"failure","errorName":"UnknownError"}
```

- The shield study addon has been uninstalled once the study ended

#### Elegibility test 1: "ineligible user on disabled telemetry"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- disable the telemetry data submission from an "about:config" tab:
  - `datareporting.policy.dataSubmissionEnabled` to `false`
- [Install the shield addon study](#download-and-install-the-shield-addon-study) section

**Expected behaviors**

- The following messages should have been logged in the Browser Console:

```
storage-init-errors-shield-study_shield_mozilla_org: Array [ "Study wants to end:", {…} ]

storage-init-errors-shield-study_shield_mozilla_org: Studying ending name: ineligible
```

- The shield study addon has been uninstalled once the study ended

### QA Test plan

QA uses the following test plan to test this add-on: **TODO add link to testrail**

### Note: checking "sent Telemetry is correct"

- Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) log output from the add-on.

See [TELEMETRY.md](./TELEMETRY.md) for more details on what pings are sent by this add-on.

## Debug

To debug installation and loading of the add-on:

- Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) and log output from the add-on.

## Peculiarities

### Find the extension storage directory

To check if the storage directory has been removed, look for the extension UUID from the "about:debugging" page,
before the extension has completed the test and uninstalled itself, then check that there isn't a directory named `moz-extension+++EXTUUID\^userContextId=4294967295/` inside `PROFILE_DIR/storage/default/`.

### Manually force a Firefox profile into the "broken storage" status

Create an empty file named `FAKE_BROKEN_STORAGE` in the following path (inside the Firefox profile used for the test) to simulate a broken profile: `PROFILE_DIR/storage/default/`.
