// functions to get the data into the necessary shape so that the Emulator
// can work with Google Cloud services (e.g. Google Cloud Functions)

/* eslint-disable no-use-before-define */

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import { isProvider, isRuntime } from '../utils/middlewareHelpers';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('google', input)) {
    // construct the functionPropPath and functionFileName
    const fileExtension = getRuntimeFileExtension(input.functionConfig.runtime);
    const functionPropPath = input.functionConfig.handler;
    const pathToFuncFile = 'index';

    transformedData.output.functionPropPath = functionPropPath;
    transformedData.output.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (isRuntime('node', input)) {
      // set the provider related default environment variables
      const FUNCTION_TRIGGER_TYPE = 'CLOUD_PUBSUB_TRIGGER';
      // TODO if (input.functionConfig.eventType === 'http') FUNCTION_TRIGGER_TYPE = 'HTTP_TRIGGER';
      const defaultEnvVars = {
        WORKER_PORT: '8091',
        GCLOUD_PROJECT: `${input.functionConfig.project}`,
        FUNCTION_NAME: `${input.functionConfig.functionName}`,
        SUPERVISOR_HOSTNAME: '192.168.1.1',
        PWD: '/user_code',
        FUNCTION_TRIGGER_TYPE,
        SHLVL: '1',
        CODE_LOCATION: '/user_code',
        FUNCTION_MEMORY_MB: `${input.functionConfig.memorySize}`,
        GCP_PROJECT: `${input.functionConfig.project}`,
        PORT: '8080',
        SUPERVISOR_INTERNAL_PORT: '8081',
        ENTRY_POINT: `${functionPropPath}`,
        OLDPWD: '/var/tmp/worker',
        _: '/usr/bin/env',
        HOME: '/tmp',
      };
      transformedData.output.env = R.merge(transformedData.output.env, defaultEnvVars);
    }
  }

  return Promise.resolve(transformedData);
};

const postLoad = (data) => {
  const transformedData = data;
  return Promise.resolve(transformedData);
};

const preInvoke = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('google', input)) {
    const functionParams = {
      event: input.payload,
      callback: (error, result) => {
        if (error) throw new Error(error);
        console.log(JSON.stringify(result)); // eslint-disable-line
      },
    };

    transformedData.output = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('google', input)) {
    if (input.errorData) {
      // TODO implement Google Cloud Functions error logic here
      transformedData.output.errorData = {
        type: 'Google Error',
        message: transformedData.input.errorData,
      };
    }
  }

  transformedData.output.outputData = transformedData.input.outputData;
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
