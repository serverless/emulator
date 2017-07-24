import path from 'path';
import getFunctionsDirectoryPath from './getFunctionsDirectoryPath';

function getFunctionConfigFilePath(serviceName, functionName) {
  const functionsDirectoryPath = getFunctionsDirectoryPath();
  const functionConfigFilePath = path.join(functionsDirectoryPath,
    serviceName, functionName, 'function.json');

  return functionConfigFilePath;
}

export default getFunctionConfigFilePath;
