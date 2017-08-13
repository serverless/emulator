import path from 'path';
import getFunctionsDirectoryPath from './getFunctionsDirectoryPath';

function getFunctionDirectoryPath(functionId) {
  const pathToFunctionsDirectory = getFunctionsDirectoryPath();
  return path.join(pathToFunctionsDirectory, functionId);
}

export default getFunctionDirectoryPath;
