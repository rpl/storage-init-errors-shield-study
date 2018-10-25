# Telemetry sent by this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

- [Usual Firefox Telemetry is mostly unaffected](#usual-firefox-telemetry-is-mostly-unaffected)
- [Study-specific endings](#study-specific-endings)
- [`shield-study` pings (common to all shield-studies)](#shield-study-pings-common-to-all-shield-studies)
- [`shield-study-addon` pings, specific to THIS study.](#shield-study-addon-pings-specific-to-this-study)
  - [Attributes](#attributes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usual Firefox Telemetry is mostly unaffected

- No change: `main` and other pings are UNAFFECTED by this add-on, except that [shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) adds the add-on id as an active experiment in the telemetry environment.
- Respects telemetry preferences. If user has disabled telemetry, no telemetry will be sent.

## Study-specific endings

This study has no surveys, but it has the following study specific ending:

- `test-idb-open-done` (`category: "ended-positive"`): the shield study addon has been able to run the "open IndexedDB" test
  and report back the results of the test

## `shield-study` pings (common to all shield-studies)

[shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) sends the usual packets.

## `shield-study-addon` pings, specific to THIS study.

A `shield-study-addon` ping is sent from the add-on once the idb open test is completed and the addon is ready to send the result
as part of the telemetry ping.

### Attributes

- `event`: `String`, it is always set to "testIDBOpen"
- `testResult`: `String`, it may be "success" or "failure"
- `errorName`: `String`, if the `testResult` is "failure", it contains the `DOMException` error name
  or "OtherError" if the caught error isn't a `DOMException`
