#!/usr/bin/env node
import R from 'ramda';

const args = process.argv.slice(2);

const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));

process.stdin.on('end', () => {
  const res = Buffer.concat(chunks).toString();
  // NOTE using eval here do deserialize the stdin payload
  // which also includes the callback function!
  // eslint-disable-next-line
  const funcParams = eval(res);

  const functionFilePath = args[0];
  const functionName = args[1];
  const func = require(functionFilePath)[functionName]; // eslint-disable-line

  func(...R.values(funcParams));
});
