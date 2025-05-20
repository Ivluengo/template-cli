import fs from 'node:fs';

import fixPackageJsonVersions from './fixPackageJsonVersions.js';
import picocolors from 'picocolors';

const CURR_DIR = process.cwd();

function createDirectoryContents(templatePath, newProjectPath) {
  try {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
      const origFilePath = `${templatePath}/${file}`;

      // get stats about the current file
      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, 'utf8');

        // Rename
        if (file === '.npmignore') file = '.gitignore';

        const writePath =
          newProjectPath !== '.' ? `${CURR_DIR}/${newProjectPath}/${file}` : `${CURR_DIR}/${file}`;

        // Fix package.json with latest versions
        file === 'package.json'
          ? fixPackageJsonVersions(origFilePath, writePath)
          : fs.writeFileSync(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        if (newProjectPath !== '.') {
          fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
        } else {
          fs.mkdirSync(`${CURR_DIR}/${file}`);
        }

        // recursive call
        if (newProjectPath !== '.') {
          createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        } else {
          createDirectoryContents(`${templatePath}/${file}`, `./${file}`);
        }
      }
    });
  } catch (error) {
    console.error(picocolors.red('❌ Error creating project'));
    console.error(error);
    process.exit(1);
  }
}

export default createDirectoryContents;
