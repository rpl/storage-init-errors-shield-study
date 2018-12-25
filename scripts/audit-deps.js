// This nodejs script loads the .nsprc's "exceptions" list (as `nsp check` used to support) and
// and then filters the output of `npm audit --json` to check if any of the security advisories
// detected should be a blocking issue and force the travis CI job to fail.
//
// We can remove this script if/once npm audit will support this feature natively
// (See https://github.com/npm/npm/issues/20565).

const shell = require('shelljs');

const npmVersion = parseInt(shell.exec('npm --version', {silent: true}).stdout.split('.')[0], 10);
const npmCmd = npmVersion >= 6 ? 'npm' : 'npx npm@latest';

if (npmCmd.startsWith('npx') && !shell.which('npx')) {
  shell.echo('Sorry, this script requires npm >= 6 or npx installed globally');
  shell.exit(1);
}

if (!shell.test('-f', 'package-lock.json')) {
  console.log('audit-deps is generating the missing package-lock.json file');
  shell.exec(`${npmCmd} i --package-lock-only`);
}

// Collect audit results and split them into blocking and ignored issues.

const auditRes = shell.exec(`${npmCmd} audit --json`, {silent: true});
const blockingIssues = [];
const ignoredIssues = [];

if (auditRes.code !== 0) {
  const exceptions = JSON.parse(shell.cat('.nsprc')).exceptions;
  const auditReport = JSON.parse(auditRes.stdout);

  for (let advId of Object.keys(auditReport.advisories)) {
    const adv = auditReport.advisories[advId];

    if (exceptions.includes(adv.url)) {
      ignoredIssues.push(adv);
      continue;
    }
    blockingIssues.push(adv);
  }
}

// Reporting.

function formatFinding(desc) {
  const details = `(dev: ${desc.dev}, optional: ${desc.optional}, bundled: ${desc.bundled})`;
  return `${desc.version} ${details}\n    ${desc.paths.join('\n    ')}`;
}

function formatAdvisory(adv) {
  const findings = adv.findings.map(formatFinding).map(msg => `  ${msg}`).join('\n');
  return `${adv.module_name} (${adv.url}):\n${findings}`;
}

if (ignoredIssues.length > 0) {
  console.log('\n== audit-deps: ignored security issues (based on .nsprc exceptions)\n');

  for (let adv of ignoredIssues) {
    console.log(formatAdvisory(adv));
  }
}

if (blockingIssues.length > 0) {
  console.log('\n== audit-deps: blocking security issues\n');

  for (let adv of blockingIssues) {
    console.log(formatAdvisory(adv));
  }

  // Exit with error if blocking security issues has been found.
  process.exit(1);
}
