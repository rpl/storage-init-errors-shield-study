/* eslint-env node */

const path  = require("path");
const shell = require("shelljs");

// Ensure that the parent directory of the test profile used by web-ext run exists.
const firefoxProfilePath = path.join(process.cwd(), "tmp", "test-profile");
shell.mkdir("-p", firefoxProfilePath);

const defaultConfig = {
  // Global options:
  sourceDir: "./src/",
  artifactsDir: "./dist/",
  ignoreFiles: [".DS_Store"],
  // Command options:
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: process.env.FIREFOX_BINARY || "nightly",
    browserConsole: true,
    startUrl: ["about:debugging"],
    pref: ["shieldStudy.logLevel=All"],
    keepProfileChanges: true,
    firefoxProfile: firefoxProfilePath,
  },
};

module.exports = defaultConfig;
