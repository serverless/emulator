#!/usr/bin/env node
import minimist from 'minimist';
import R from 'ramda';

const argv = minimist(process.argv.slice(2));
const options = R.omit(['_'], argv);

const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));

process.stdin.on('end', () => {
  const result = Buffer.concat(chunks).toString();
  const payload = JSON.parse(result);

  const functionFilePath = options.functionFilePath;
  const functionName = options.functionName;
  const func = require(functionFilePath)[functionName]; //eslint-disable-line

  func(payload, {}, (error, message) => {
    process.stdout.write(JSON.stringify(message));
  });
});
