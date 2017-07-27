import decompress from 'decompress';
import getFunctionCodeDirectoryPath from './getFunctionCodeDirectoryPath';

async function unzipFunctionCode(zipFilePath, serviceName, functionName) {
  const functionCodeDirectoryPath = getFunctionCodeDirectoryPath(serviceName, functionName);
  return decompress(zipFilePath, functionCodeDirectoryPath);
}

export default unzipFunctionCode;
