import readFile from './fs/readFile';
import getFunctionConfigFilePath from './getFunctionConfigFilePath';

async function readFunctionConfigFile(functionId) {
  const functionConfigFilePath = getFunctionConfigFilePath(functionId);
  return readFile(functionConfigFilePath);
}

export default readFunctionConfigFile;
