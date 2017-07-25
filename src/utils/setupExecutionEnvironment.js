import path from 'path';
import childProcess from 'child_process';
import validateRuntime from './validateRuntime';
import getRuntimeScriptName from './getRuntimeScriptName';
import getRuntimeFileExtension from './getRuntimeFileExtension';
import getRuntimeExecName from './getRuntimeExecName';
import getFunctionCodeDirectoryPath from './getFunctionCodeDirectoryPath';

const runtimesDir = path.join(__dirname, '..', 'runtimes');

async function setupExecutionEnvironment(serviceName, functionName, functionConfig) {
  const runtime = functionConfig.runtime;
  validateRuntime(runtime);

  const script = getRuntimeScriptName(runtime);
  const fileExtension = getRuntimeFileExtension(runtime);
  const exec = getRuntimeExecName(runtime);

  const pathToScript = path.join(runtimesDir, script);
  const pathToFunctionCode = getFunctionCodeDirectoryPath(serviceName, functionName);

  // NOTE AWS specific data transformation (should be handled by a middleware)
  const handler = functionConfig.handler;
  const funcName = handler.split('/').pop();
  const pathToFuncFile = handler.split('/').slice(0, -1);
  const funcFileName = `${pathToFuncFile}${fileExtension}`;

  const childProc = childProcess.spawn(exec, [
    `${pathToScript}`,
    '--functionFilePath', path.join(pathToFunctionCode, funcFileName),
    '--functionName', funcName,
  ]);

  return {
    stdin: childProc.stdin,
    stdout: childProc.stdout,
    stderr: childProc.stderr,
  };
}

export default setupExecutionEnvironment;
