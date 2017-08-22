import getRuntimeExecName from './getRuntimeExecName';

export default function isRuntime(runtime, data) {
  const runtimeExec = getRuntimeExecName(data.functionConfig.runtime);
  return runtimeExec === runtime;
}
