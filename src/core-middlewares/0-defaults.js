// necessary defaults for all services

import R from 'ramda';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const preLoad = async (data) => {
  const transformedData = R.clone(data);
  const { input } = transformedData;

  if (input.functionConfig.runtime) {
    const runtimeExec = getRuntimeExecName(input.functionConfig.runtime);

    if (runtimeExec === 'node') {
      // NOTE this env is necessary for the Node.js runtime!
      // otherwise the child process fails!
      const defaultEnvVars = process.env;
      transformedData.output.env = R.merge(transformedData.output.env, defaultEnvVars);
    }
  }

  return Promise.resolve(transformedData);
};

const postLoad = async data => Promise.resolve(data);

const preInvoke = async data => Promise.resolve(data);

const postInvoke = async data => Promise.resolve(data);

export { preLoad, postLoad, preInvoke, postInvoke };
