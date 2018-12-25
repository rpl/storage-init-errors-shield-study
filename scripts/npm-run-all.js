const shell = require("shelljs");

const packageJSONPath = `${process.cwd()}/package.json`;
const scriptPrefix = process.argv[2];

const scripts = require(packageJSONPath).scripts;
console.log(`Running all scripts defined in './package.json' starting with '${scriptPrefix}'`);

const scriptNames = Object.keys(scripts).filter(scriptName => scriptName.startsWith(scriptPrefix));

for (let script of scriptNames) {
  console.log(`> npm run ${script}`);
  const res = shell.exec(`npm run ${script}`);
  if (res.code !== 0) {
    process.exit(res.code);
  }
}
