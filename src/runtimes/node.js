#!/usr/bin/env node
import minimist from 'minimist';
import R from 'ramda';

const argv = minimist(process.argv.slice(2));
const options = R.omit(['_'], argv);

const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));

process.stdin.on('end', () => {
  const res = Buffer.concat(chunks).toString();
  const params = JSON.parse(res);

  const functionFilePath = options.functionFilePath;
  const functionName = options.functionName;
  const func = require(functionFilePath)[functionName]; // eslint-disable-line

  func(...Object.values(params), (error, result) => {
    if (error) throw new Error(error);
    const serializedResult = JSON.stringify(result);
    console.log(serializedResult); // eslint-disable-line
  });
});
