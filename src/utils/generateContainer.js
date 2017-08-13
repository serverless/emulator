import path from 'path';
import childProcess from 'child_process';
import R from 'ramda';
import validateRuntime from './validateRuntime';
import getContainerKey from './getContainerKey';
import getRuntimeScriptName from './getRuntimeScriptName';
import getRuntimeExecName from './getRuntimeExecName';
import getFunctionCodeDirectoryPath from './getFunctionCodeDirectoryPath';
import runMiddlewares from './runMiddlewares';

const runtimesDir = path.join(__dirname, '..', 'runtimes');

let containers = {}

async function generateContainer(functionId, functionConfig, containerConfig) {
  const runtime = functionConfig.runtime;
  validateRuntime(runtime);

  const key = getContainerKey(runtime, functionId);
  if (R.has(key, containers)) {
    return R.prop(key, containers);
  }

  const script = getRuntimeScriptName(runtime);
  const exec = getRuntimeExecName(runtime);

  const pathToScript = path.join(runtimesDir, script);
  const pathToFunctionCode = getFunctionCodeDirectoryPath(functionId);

  const preLoadInput = { functionId, functionConfig, containerConfig };
  const preLoadOutput = await runMiddlewares('preLoad', preLoadInput);

  // combine provider env vars with the function specific env vars
  const env = R.merge(preLoadOutput.env, functionConfig.env);
  let execArgs = preLoadOutput.execArgs || [];
  execArgs = execArgs.concat([`${pathToScript}`, path.join(pathToFunctionCode, preLoadOutput.functionFileName), preLoadOutput.functionPropPath]);

  const childProc = childProcess.spawn(
    exec,
    execArgs,
    { env },
  );

  //childProc.stdout.on('data', (data) => console.log(data.toString()))
  // TODO const postLoadResult = await runMiddlewares('postLoad', postLoadPayload);

  const close = () => {
    if (!childProc.killed) {
      childProc.kill();
    }
    childProc.removeAllListeners();
    containers = R.dissoc(key, containers);
  };

  const container = {
    close,
    key,
    process: childProc,
    runtime,
  };

  containers = R.assoc(key, container, containers);
  return container;
}

export default generateContainer;
