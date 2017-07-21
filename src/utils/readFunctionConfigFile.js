import readFile from './fs/readFile';
import getFunctionConfigFilePath from './getFunctionConfigFilePath';

async function readFunctionConfigFile(serviceName, functionName) {
  const functionConfigFilePath = getFunctionConfigFilePath(serviceName, functionName);
  return readFile(functionConfigFilePath);
}

export default readFunctionConfigFile;

