// necessary defaults for all services

import R from 'ramda';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.runtime) {
    const runtimeExec = getRuntimeExecName(payload.functionConfig.runtime);

    if (runtimeExec === 'node') {
      const defaultEnvVars = {
        // NOTE this env is necessary for the Node.js runtime!
        // otherwise the child process fails!
        PATH: '/usr/local/lib64/node-v6.10.x/bin:/usr/local/bin:/usr/bin/:/bin',
      };
      transformedData.result.env = R.merge(transformedData.result.env, defaultEnvVars);
    }
  }

  return Promise.resolve(transformedData);
};

const postLoad = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const preInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
