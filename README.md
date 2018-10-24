# "Storage initialization errors" v1 - Shield study

[![CircleCI](https://circleci.com/gh/rpl/storage-init-errors-shield-study.svg?style=svg)](https://circleci.com/gh/rpl/storage-init-errors-shield-study)

This shield study verifies if a user profile is affected by "Storage Initialization issues" which prevent IndexedDB
databases to be opened, and then reports back with the results of the test as part of the `shield-study-addon`
telemetry ping.

## Seeing the add-on in action

See [TESTPLAN.md](./docs/TESTPLAN.md) for more details on how to get the add-on installed and tested.

## Data Collected / Telemetry Pings

See [TELEMETRY.md](./docs/TELEMETRY.md) for more details on what pings are sent by this add-on.

## Analyzing data

Telemetry pings are loaded into S3 and re:dash. Sample query:

- All pings - (TODO add a link to an example STMO query)

## Improving this add-on

See [DEV.md](./docs/DEV.md) for more details on how to work with this add-on as a developer.

# History

- "Storage initialization errors" v1 - PHD (TODO: link to the PHD google doc)
