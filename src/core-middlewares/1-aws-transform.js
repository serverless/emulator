// functions to get the data into the necessary shape so that the Local Emulator
// can work with AWS services (e.g. Lambda functions)

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'aws') {
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
      const defaultEnvVars = {
        PATH: '/usr/local/lib64/node-v4.3.x/bin:/usr/local/bin:/usr/bin/:/bin',
        LANG: 'en_US.UTF-8',
        LD_LIBRARY_PATH: '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib', // eslint-disable-line max-len
        LAMBDA_TASK_ROOT: '/var/task',
        LAMBDA_RUNTIME_DIR: '/var/runtime',
        AWS_REGION: payload.functionConfig.env.REGION,
        AWS_DEFAULT_REGION: payload.functionConfig.env.REGION,
        AWS_LAMBDA_LOG_GROUP_NAME: payload.functionConfig.env.LOG_GROUP_NAME,
        AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
        AWS_LAMBDA_FUNCTION_NAME: payload.functionConfig.env.FUNCTION_NAME,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: payload.functionConfig.env.MEMORY_SIZE,
        AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
        NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules',
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

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'aws') {
    const functionParams = {
      event: payload.payload,
      context: {},
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


export { preLoad, postLoad, preInvoke, postInvoke };
