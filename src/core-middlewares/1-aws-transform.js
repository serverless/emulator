// functions to get the data into the necessary shape so that the Local Emulator
// can work with AWS services (e.g. Lambda functions)

/* eslint-disable no-use-before-define */

import path from 'path';
import R from 'ramda';
import getFreePort from '../utils/getFreePort';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';
import isProvider from '../utils/isProvider';
import isRuntime from '../utils/isRuntime';

const load = async (data, next) => {

  if (isProvider('aws', data)) {
    // construct the functionPropPath and functionFileName
    const { functionConfig, containerConfig } = data;
    const { handler, runtime } = functionConfig;
    const fileExtension = getRuntimeFileExtension(runtime);
    const functionPropPath = handler.split('.')[1];
    const pathToFuncFile = handler.split('.')[0].replace(/\//g, path.sep);

    data = {
      ...data,
      functionPropPath,
      functionFileName: `${pathToFuncFile}${fileExtension}`,
    }

    // for functions written in Node.js
    if (isRuntime('node', data)) {
      // set the provider related default environment variables
      const defaultEnvVars = {
        LANG: 'en_US.UTF-8',
        LAMBDA_TASK_ROOT: '/var/task',
        LAMBDA_RUNTIME_DIR: '/var/runtime',
        AWS_REGION: functionConfig.region,
        AWS_DEFAULT_REGION: functionConfig.region,
        AWS_LAMBDA_LOG_GROUP_NAME: `aws/lambda/${functionConfig.lambdaName}`,
        AWS_LAMBDA_LOG_STREAM_NAME: '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
        AWS_LAMBDA_FUNCTION_NAME: functionConfig.lambdaName,
        AWS_LAMBDA_FUNCTION_MEMORY_SIZE: functionConfig.memorySize,
        AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      };

      data = {
        ...data,
        env: R.merge(data.env, defaultEnvVars)
      };

      if (containerConfig.debug) {
        const debugPort = await getFreePort(9229);
        // TODO BRN: --inspect only works for node 6.3+ need to support node 4 here as well
        data = {
          ...data,
          execArgs: data.execArgs.concat([`--inspect=${debugPort}`])
        };
      }
    }
  }
  return await next(data);
};

export { load };
