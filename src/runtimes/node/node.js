#!/usr/bin/env node
import R from 'ramda';
import invokeFunction from './utils/invokeFunction';
import loadConfig from './utils/loadConfig';
import loadFunction from './utils/loadFunction';
import monkeyPatchConsole from './utils/monkeyPatchConsole';
import createChannel from '../../utils/ipc/createChannel';

const channel = createChannel(process);

monkeyPatchConsole(channel);
handleUncaughtErrors(channel);

const config = loadConfig();
const { functionFilePath, functionPropPath } = config;
const func = loadFunction(functionFilePath, functionPropPath);
const provider = loadProvider(config);

channel.on('invoke', (message) => {
  const { data } = message;
  invokeFunction(func, data, provider, channel);
});
