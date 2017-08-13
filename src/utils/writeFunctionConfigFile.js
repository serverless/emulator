import writeFile from './fs/writeFile';
import getFunctionConfigFilePath from './getFunctionConfigFilePath';

async function writeFunctionJsonFile(functionConfig, functionId) {
  const functionConfigFilePath = getFunctionConfigFilePath(functionId);
  return writeFile(functionConfigFilePath, functionConfig);
}

export default writeFunctionJsonFile;
