// functions to get the data into the necessary shape so that the Local Emulator
// can work with AWS services (e.g. Lambda functions)

/* eslint-disable no-use-before-define */

import path from 'path';
import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import { isProvider, isRuntime } from '../utils/middlewareHelpers';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('aws', input)) {
    // construct the functionName and functionFileName
    const fileExtension = getRuntimeFileExtension(input.functionConfig.runtime);
    const handler = input.functionConfig.handler;
    const functionName = handler.split('.')[1];
    const pathToFuncFile = handler.split('.')[0].replace(/\//g, path.sep);

    transformedData.output.functionName = functionName;
    transformedData.output.functionFileName = `${pathToFuncFile}${fileExtension}`;

    // for functions written in Node.js
    if (isRuntime('node', input)) {
      // set the provider related default environment variables
      const defaultEnvVars = {
        LANG: 'en_US.UTF-8',
        LAMBDA_TASK_ROOT: '/var/task',
        LAMBDA_RUNTIME_DIR: '/var/runtime',
        AWS_REGION: input.functionConfig.region,
        AWS_DEFAULT_REGION: input.functionConfig.region,
        AWS_LAMBDA_LOG_GROUP_NAME: `aws/lambda/${input.functionConfig.lambdaName}`,
        AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
        AWS_LAMBDA_FUNCTION_NAME: input.functionConfig.lambdaName,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: input.functionConfig.memorySize,
        AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
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

  if (isProvider('aws', input)) {
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
      event: input.payload,
      context: {
        awsRequestId: 'id',
        invokeid: 'id',
        logGroupName: `aws/lambda/${input.functionConfig.lambdaName}`,
        logStreamName: '2015/09/22/[HEAD]13370a84ca4ed8b77c427af260',
        functionVersion: 'HEAD',
        isDefaultFunctionVersion: true,
        functionName: input.functionConfig.lambdaName,
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

    transformedData.output = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (isProvider('aws', input)) {
    if (transformedData.input.errorData) {
      transformedData.output.errorData = {
        errorMessage: input.errorData,
      };
    }
  }

  transformedData.output.outputData = transformedData.input.outputData;
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
