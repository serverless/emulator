// functions to get the data into the necessary shape so that the Local Emulator
// can work with Google Cloud services (e.g. Google Cloud Functions)

/* eslint-disable no-use-before-define */

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import { getPathToFunctionFile, getFunctionName, isProvider, isRuntime } from '../utils/middlewareHelpers';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('google', input)) {
    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(input.functionConfig.runtime);
    const handler = input.functionConfig.handler;
    const pathToFuncFile = getPathToFunctionFile(handler);

    transformedData.output.functionName = getFunctionName(handler);
    transformedData.output.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (isRuntime('node', input)) {
      // set the provider related default environment variables
      const defaultEnvVars = {};
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
