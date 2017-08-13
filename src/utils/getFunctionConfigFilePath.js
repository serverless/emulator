import path from 'path';
import getFunctionsDirectoryPath from './getFunctionsDirectoryPath';

function getFunctionConfigFilePath(functionId) {
  const functionsDirectoryPath = getFunctionsDirectoryPath();
  const functionConfigFilePath = path.join(functionsDirectoryPath,
    functionId, 'function.json');

  return functionConfigFilePath;
}

export default getFunctionConfigFilePath;
