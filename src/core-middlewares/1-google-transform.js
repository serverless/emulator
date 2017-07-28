// functions to get the data into the necessary shape so that the Local Emulator
// can work with Google Cloud services (e.g. Google Cloud Functions)

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'google') {
    const runtimeExec = getRuntimeExecName(payload.functionConfig.runtime);

    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(payload.functionConfig.runtime);
    const handler = payload.functionConfig.handler;
    const pathToFuncFile = handler.split('/').slice(0, -1);

    transformedData.result.functionName = handler.split('/').pop();
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

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'google') {
    const functionParams = {
      event: payload.payload,
    };

    transformedData.result = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'google') {
    if (transformedData.payload.errorData) {
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


export { preLoad, postLoad, preInvoke, postInvoke };
