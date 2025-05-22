import fs from 'node:fs';
import cliSpinners from 'cli-spinners';
import ora from 'ora';

import getLatestPackageVersions from './getLatestPackageVersions.js';

export default function fixPackageJsonVersions(origFilePath, writePath) {
  // Printing an animation while the file is being fixed
  // TODO: Fix the spinner
  const spinner = ora(cliSpinners.dots12).start();

  const contents = fs.readFileSync(origFilePath, 'utf8');
  const parsedContent = JSON.parse(contents);
  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const section of sections) {
    if (!parsedContent[section]) continue;
    for (const [pkg, version] of Object.entries(parsedContent[section])) {
      if (version === '*') parsedContent[section][pkg] = getLatestPackageVersions(pkg);
    }
  }
  fs.writeFileSync(writePath, JSON.stringify(parsedContent, null, 2), 'utf8');

  spinner.stop();
}
