# Developing this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

- [Preparations](#preparations)
- [Getting started](#getting-started)
- [General Shield Study Engineering](#general-shield-study-engineering)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Preparations

- Download last Nightly and Developer Edition versions of Firefox (as Beta requires a signed shield addon study extension)

## Getting started

```shell
# install dependencies
npm install

## run functional tests
npm run test

## run the extension in a Firefox instance
npm start

## run and reload on filechanges
npm run watch

# run and reload on filechanges, with a specific Firefox installation
npm run watch -- -f "/path/to/firefox-bin"

## lint
npm run lint

## build (generates extension zip file)
npm run build

## format markdown files
npm run docformat
```

## General Shield Study Engineering

This Shield study add-on is a web extensions, its `src/` directory contains:

- the extension manifest (`src/manifest.json`)
- a studySetup file included in the background page (`src/studySetup.js`)
- a background script (`src/background.js`)
- the shield study experiment API from `shield-study-addon-utils` (`src/privileged/study`)
- the experiment API specific to this shield study add-on (`src/privileged/testIDBOpen`):

  - `src/privileged/testIDBOpen/schema.json` contains the API schema
  - `src/privileged/testIDBOpen/api.js` contains the API implementation

- and one or more embedded Web Extension Experiments (`src/privileged/*/api.js`) that allows them to run privileged code.

Privileged code allows access to Telemetry data, user preferences etc that are required for collecting relevant data for [Shield Studies](https://wiki.mozilla.org/Firefox/Shield/Shield_Studies).

For more information, see <https://github.com/mozilla/shield-studies-addon-utils/> (especially <https://github.com/mozilla/shield-studies-addon-utils/blob/master/docs/engineering.md>).
