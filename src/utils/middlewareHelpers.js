import path from 'path';
import getRuntimeExecName from './getRuntimeExecName';

function getPathToFunctionFile(handler) {
  return handler.split('.')[0].replace(/\//g, path.sep);
}

function getFunctionName(handler) {
  return handler.split('.')[1];
}

function isProvider(provider, input) {
  return input.functionConfig.provider && input.functionConfig.provider === provider;
}

function isRuntime(runtime, input) {
  const runtimeExec = getRuntimeExecName(input.functionConfig.runtime);
  return runtimeExec === runtime;
}

export { getPathToFunctionFile, getFunctionName, isProvider, isRuntime };
