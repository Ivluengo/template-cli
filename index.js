#!/usr/bin/env node

import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import inquirer from 'inquirer';

import createDirectoryContents from './utils/createDirectoryContents.js';
import picocolors from 'picocolors';

const CURRENT_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'projectChoice',
    type: 'list',
    message: 'Which template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'Folder name: (. to create in current folder)',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input) || input === '.') return true;
      else
        return 'Folder names can only include letters, numbers, hyphens and underscores. You can also use a dot to create it in the current folder.';
    },
  },
];

inquirer
  .prompt(QUESTIONS)
  .then(answers => {
    const projectChoice = answers.projectChoice;
    const projectName = answers.projectName;
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    if (projectName !== '.') {
      fs.mkdirSync(path.join(CURRENT_DIR, projectName));
    }

    createDirectoryContents(templatePath, projectName);

    console.log(picocolors.green('✅ Project created successfully'));
  })
  .catch(error => {
    console.log(picocolors.red('❌ Error creating project'));
    console.log(error);
    process.exit(1);
  });
