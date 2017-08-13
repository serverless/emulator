#!/usr/bin/env node
import R from 'ramda';
import minimist from 'minimist';

const slice = R.test(/^--inspect/, process.argv[1]) ? 3 : 2;
const args = minimist(process.argv.slice(slice));

const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));

process.stdin.on('end', () => {
  const res = Buffer.concat(chunks).toString();
  // NOTE using eval here do deserialize the stdin payload
  // which also includes the callback function!
  // eslint-disable-next-line
  const funcParams = eval(res);

  const functionFilePath = args._[0];
  const functionPropPath = args._[1];
  const imported = require(functionFilePath); // eslint-disable-line
  const func = functionPropPath ? imported[functionPropPath] : imported;

  func(...R.values(funcParams));
});
