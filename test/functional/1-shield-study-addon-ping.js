/* eslint-env node, mocha */

// for unhandled promise rejection debugging
process.on("unhandledRejection", r => console.error(r)); // eslint-disable-line no-console

const assert = require("assert");
const path = require("path");
const shelljs = require("shelljs");

const utils = require("./utils");

describe("shield-study-addon ping on successfull IDB open", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(25000);

  let driver;
  let beginTime;

  // runs ONCE
  before(async () => {
    beginTime = Date.now();
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );

    await utils.setupWebdriver.installAddon(driver);
  });

  after(async () => {
    driver.quit();
  });

  beforeEach(async () => {});
  afterEach(async () => {});

  describe("should have sent the expected addon-specific telemetry", function() {
    let studyPings;

    before(async () => {
      // allow our shield study add-on some time to send initial pings
      await driver.sleep(2000);
      // collect sent pings
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        beginTime,
      );
      // for debugging tests
      // console.log("Pings report: ", utils.telemetry.pingsReport(studyPings));
    });

    it("should have sent at least one shield telemetry ping", async () => {
      assert(studyPings.length > 0, "at least one shield telemetry ping");
    });

    it("sent expected telemetry", function() {
      // Telemetry:  order, and summary of pings is good.
      const filteredPings = studyPings.filter(
        ping => ping.type === "shield-study-addon",
      );

      const observed = utils.telemetry.summarizePings(filteredPings);
      const expected = [
        [
          "shield-study-addon",
          {
            "attributes": {
              "event": "testIDBOpen",
              "testResult": "success",
            },
          },
        ],
      ];
      assert.deepStrictEqual(observed, expected, "telemetry pings match");
    });
  });
});

describe("shield-study-addon ping on IDB open errors", function() {
  // This gives Firefox time to start, and us a bit longer during some of the tests.
  this.timeout(25000);

  let driver;
  let beginTime;

  // runs ONCE
  before(async () => {
    beginTime = Date.now();
    driver = await utils.setupWebdriver.promiseSetupDriver(
      utils.FIREFOX_PREFERENCES,
    );

    const profileDir = (await driver.getCapabilities()).get("moz:profile");
    const storageDir = path.join(profileDir, "storage", "default");
    shelljs.mkdir("-p", storageDir);
    shelljs.touch(path.join(storageDir, "BREAK_STORAGE_INIT"));

    await utils.setupWebdriver.installAddon(driver);
  });

  after(async () => {
    driver.quit();
  });

  beforeEach(async () => {});
  afterEach(async () => {});

  describe("should have sent the expected addon-specific telemetry", function() {
    let studyPings;

    before(async () => {
      // allow our shield study add-on some time to send initial pings
      await driver.sleep(2000);
      // collect sent pings
      studyPings = await utils.telemetry.getShieldPingsAfterTimestamp(
        driver,
        beginTime,
      );
      // for debugging tests
      // console.log("Pings report: ", utils.telemetry.pingsReport(studyPings));
    });

    it("should have sent at least one shield telemetry ping", async () => {
      assert(studyPings.length > 0, "at least one shield telemetry ping");
    });

    it("sent expected telemetry", function() {
      // Telemetry:  order, and summary of pings is good.
      const filteredPings = studyPings.filter(
        ping => ping.type === "shield-study-addon",
      );

      const observed = utils.telemetry.summarizePings(filteredPings);
      const expected = [
        [
          "shield-study-addon",
          {
            "attributes": {
              "event": "testIDBOpen",
              "testResult": "failure",
              "errorName": "UnknownError",
            },
          },
        ],
      ];
      assert.deepStrictEqual(observed, expected, "telemetry pings match");
    });
  });
});
