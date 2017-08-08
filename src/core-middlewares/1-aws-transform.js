// functions to get the data into the necessary shape so that the Local Emulator
// can work with AWS services (e.g. Lambda functions)

/* eslint-disable no-use-before-define */

import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import { getPathToFunctionFile, getFunctionName, isProvider, isRuntime } from '../utils/middlewareHelpers';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (isProvider('aws', payload)) {
    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(payload.functionConfig.runtime);
    const handler = payload.functionConfig.handler;
    const pathToFuncFile = getPathToFunctionFile(handler);

    transformedData.result.functionName = getFunctionName(handler);
    transformedData.result.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (isRuntime('node', payload)) {
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

  if (isProvider('aws', payload)) {
    const startTime = new Date();
    const callback = (error, result) => {
      if (error) {
        throw new Error(error);
      } else if (result) {
        if (result.headers && result.headers['Content-Type'] === 'application/json') {
          if (result.body) {
            try {
              Object.assign(result, {
                body: JSON.parse(result.body),
              });
            } catch (e) {
              throw new Error('Content-Type of response is application/json but body is not json');
            }
          }
        }
        console.log(JSON.stringify(result)); // eslint-disable-line
      }
    };
    const functionParams = {
      event: payload.payload,
      context: {
        awsRequestId: 'id',
        invokeid: 'id',
        logGroupName: payload.functionConfig.env.LOG_GROUP_NAME,
        logStreamName: '2015/09/22/[HEAD]13370a84ca4ed8b77c427af260',
        functionVersion: 'HEAD',
        isDefaultFunctionVersion: true,
        functionName: payload.functionConfig.env.FUNCTION_NAME,
        memoryLimitInMB: '1024',
        succeed(result) {
          return this.callback(null, result);
        },
        fail(error) {
          return this.callback(error);
        },
        done(error, result) {
          return this.callback(error, result);
        },
        getRemainingTimeInMillis() {
          return (new Date()).valueOf() - startTime.valueOf();
        },
        // NOTE: this is just a quick fix / hack so that the methods above can access the callback
        callback,
      },
      callback,
    };

    transformedData.result = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (isProvider('aws', payload)) {
    if (transformedData.payload.errorData) {
      transformedData.result.errorData = {
        errorMessage: payload.errorData,
      };
    }
  }

  transformedData.result.outputData = transformedData.payload.outputData;
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
