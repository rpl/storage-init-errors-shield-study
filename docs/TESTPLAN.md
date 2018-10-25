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

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Manual / QA TEST Instructions

### Preparations

- Download last Nightly and Beta versions of Firefox (NOTE: Beta requires a signed shield addon study extension)
- Run Firefox instance and apply the neeeded about:config changes to the profile before enrolling in the study:
  - Navigate to _about:config_ and set the following preferences. (If a preference does not exist, create it be right-clicking in the white area and selecting New -> String)
  - Set `shieldStudy.logLevel` to `All`. This permits shield-add-on log output in browser console.

### Download and install the shield addon study

- Go to "TODO add link to shield addon xpi file attached to the repo github releases" and install the latest add-on zip file

## Expected Functionality

This shield study doesn't present any UI or exit surveys to the user, and so the expected functionality has to be verified by
looking that the expected telemetry has been sent as expected, by looking at the logs collected in the browser console as described in
the following sub section: [Note: checking "sent Telemetry is correct"](#note-checking-sent-telemetry-is-correct).

### Tests STRs

#### Functionality test 1: "telemetry sent on users without any storage initialization issue"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- [Download and install the shield addon study](#download-and-install-the-shield-addon-study) section

**Expected behaviors**

- The following messages should have been logged in the Browser Console:
  - TODO mention which are the log messages to look for
- The shield study addon has been uninstalled once the study ended
- Once the shield study addon has been removed, the storage directory for the extension has been removed from the Firefox profile dir
  (TODO mention how to identify the storage directory)

#### Functionality test 2: "telemetry sent on users with storage initialization issue"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- Set the following shield study test preference (which will allow to prepare a fake broken profile to run the test on)
  - TODO add a test preference to wait for before running the "IDB open test"?
- [Download and install the shield addon study](#download-and-install-the-shield-addon-study) section
- Add the following file in the storage directory of the related Firefox profile:
  - TODO add info about where the file has to be created

**Expected behaviors**

- The following messages should have been logged in the Browser Console:
  - TODO mention which are the log messages to look for
- The shield study addon has been uninstalled once the study ended

#### Elegibility test 1: "ineligible user on disabled telemetry"

- [Prepare the Firefox instance](#preparations)
- [Open the browser console](#note-checking-sent-telemetry-is-correct)
- disable the telemetry
  - TODO add info about how to disable telemetry
- [Download and install the shield addon study](#download-and-install-the-shield-addon-study) section
- Add the following file in the storage directory of the related Firefox profile:
  - TODO add info about where the file has to be created

**Expected behaviors**

- The following messages should have been logged in the Browser Console:
  - TODO mention which are the log messages to look for
- The shield study addon has been uninstalled once the study ended

### QA Test plan

QA uses the following test plan to test this add-on: TODO add link to testrail

### Note: checking "sent Telemetry is correct"

- Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) log output from the add-on.

See [TELEMETRY.md](./TELEMETRY.md) for more details on what pings are sent by this add-on.

## Debug

To debug installation and loading of the add-on:

- Open the Browser Console using Firefox's top menu at `Tools > Web Developer > Browser Console`. This will display Shield (loading/telemetry) and log output from the add-on.

## Peculiarities

- TBD (e.g. how to force a profile to trigger the IDB initialization error)
