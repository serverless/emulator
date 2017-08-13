import path from 'path';
import getFunctionDirectoryPath from './getFunctionDirectoryPath';

function getFunctionCodeDirectoryPath(functionId) {
  const pathToFunctionDirectory = getFunctionDirectoryPath(functionId);
  return path.join(pathToFunctionDirectory, 'code');
}

export default getFunctionCodeDirectoryPath;
