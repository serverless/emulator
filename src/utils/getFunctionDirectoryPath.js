import path from 'path';
import getFunctionsDirectoryPath from './getFunctionsDirectoryPath';

function getFunctionDirectoryPath(serviceName, functionName) {
  const pathToFunctionsDirectory = getFunctionsDirectoryPath();
  return path.join(pathToFunctionsDirectory, serviceName, functionName);
}

export default getFunctionDirectoryPath;
