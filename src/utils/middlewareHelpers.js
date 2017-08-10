import getRuntimeExecName from './getRuntimeExecName';

function isProvider(provider, input) {
  return input.functionConfig.provider && input.functionConfig.provider === provider;
}

function isRuntime(runtime, input) {
  const runtimeExec = getRuntimeExecName(input.functionConfig.runtime);
  return runtimeExec === runtime;
}

export { isProvider, isRuntime };
