import path from 'path';
import getFunctionDirectoryPath from './getFunctionDirectoryPath';

function getFunctionCodeDirectoryPath(serviceName, functionName) {
  const pathToFunctionDirectory = getFunctionDirectoryPath(serviceName, functionName);
  return path.join(pathToFunctionDirectory, 'code');
}

export default getFunctionCodeDirectoryPath;
