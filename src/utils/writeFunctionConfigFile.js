import writeFile from './fs/writeFile';
import getFunctionConfigFilePath from './getFunctionConfigFilePath';

async function writeFunctionJsonFile(functionConfig, serviceName, functionName) {
  const functionConfigFilePath = getFunctionConfigFilePath(serviceName, functionName);
  return writeFile(functionConfigFilePath, functionConfig);
}

export default writeFunctionJsonFile;
