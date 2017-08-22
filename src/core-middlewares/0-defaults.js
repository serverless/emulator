// necessary defaults for all services

import R from 'ramda';
import getRuntimeExecName from '../utils/getRuntimeExecName';

const load = async (data, next) => {

  if (data.functionConfig.runtime) {
    const runtimeExec = getRuntimeExecName(data.functionConfig.runtime);

    if (runtimeExec === 'node') {
      // NOTE this env is necessary for the Node.js runtime!
      // otherwise the child process fails!
      const defaultEnvVars = process.env;
      data.env = R.merge(data.env, defaultEnvVars);
    }
  }

  return await next(data);
};

const invoke = async (data, next) => await next(data);

export { load, invoke };
