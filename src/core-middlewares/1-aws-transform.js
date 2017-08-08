// functions to get the data into the necessary shape so that the Local Emulator
// can work with AWS services (e.g. Lambda functions)

/* eslint-disable no-use-before-define */

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (isProviderAws(payload)) {
    const runtimeExec = getRuntimeExecName(payload.functionConfig.runtime);

    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(payload.functionConfig.runtime);
    const handler = payload.functionConfig.handler;
    const pathToFuncFile = handler.split('/').pop().split('.')[0];

    transformedData.result.functionName = handler.split('/').pop().split('.')[1];
    transformedData.result.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (runtimeExec === 'node') {
      // set the provider related default environment variables
      const defaultEnvVars = {
        LANG: 'en_US.UTF-8',
        LAMBDA_TASK_ROOT: '/var/task',
        LAMBDA_RUNTIME_DIR: '/var/runtime',
        AWS_REGION: payload.functionConfig.region,
        AWS_DEFAULT_REGION: payload.functionConfig.region,
        AWS_LAMBDA_LOG_GROUP_NAME: `aws/lambda/${payload.functionConfig.lambdaName}`,
        AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
        AWS_LAMBDA_FUNCTION_NAME: payload.functionConfig.lambdaName,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: payload.functionConfig.memorySize,
        AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      };
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

  if (isProviderAws(payload)) {
    const functionParams = {
      event: payload.payload,
      context: {},
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

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'aws') {
    if (transformedData.payload.errorData) {
      // TODO implement AWS Lambda error logic here
      transformedData.result.errorData = {
        type: 'AWS Error',
        message: transformedData.payload.errorData,
      };
    }
  }

  transformedData.result.outputData = transformedData.payload.outputData;
  return Promise.resolve(transformedData);
};

// helper functions
function isProviderAws(payload) {
  return payload.functionConfig.provider && payload.functionConfig.provider === 'aws';
}

export { preLoad, postLoad, preInvoke, postInvoke };
