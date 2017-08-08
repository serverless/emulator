// functions to get the data into the necessary shape so that the Local Emulator
// can work with Google Cloud services (e.g. Google Cloud Functions)

/* eslint-disable no-use-before-define */

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import getRuntimeExecName from '../utils/getRuntimeExecName';
import { getPathToFunctionFile, getFunctionName } from '../utils/middlewareHelpers';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (isProviderGoogle(payload)) {
    const runtimeExec = getRuntimeExecName(payload.functionConfig.runtime);

    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(payload.functionConfig.runtime);
    const handler = payload.functionConfig.handler;
    const pathToFuncFile = getPathToFunctionFile(handler);

    transformedData.result.functionName = getFunctionName(handler);
    transformedData.result.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (runtimeExec === 'node') {
      // set the provider related default environment variables
      const defaultEnvVars = {};
      transformedData.result.env = R.merge(transformedData.result.env, defaultEnvVars);
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
  const { payload } = transformedData;

  if (isProviderGoogle(payload)) {
    const functionParams = {
      event: payload.payload,
      callback: (error, result) => {
        if (error) throw new Error(error);
        console.log(JSON.stringify(result)); // eslint-disable-line
      },
    };

    transformedData.result = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (isProviderGoogle(payload)) {
    if (payload.errorData) {
      // TODO implement Google Cloud Functions error logic here
      transformedData.result.errorData = {
        type: 'Google Error',
        message: transformedData.payload.errorData,
      };
    }
  }

  transformedData.result.outputData = transformedData.payload.outputData;
  return Promise.resolve(transformedData);
};

// helper functions
function isProviderGoogle(payload) {
  return payload.functionConfig.provider && payload.functionConfig.provider === 'google';
}

export { preLoad, postLoad, preInvoke, postInvoke };
