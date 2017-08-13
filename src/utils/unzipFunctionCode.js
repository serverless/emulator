import decompress from 'decompress';
import getFunctionCodeDirectoryPath from './getFunctionCodeDirectoryPath';

async function unzipFunctionCode(zipFilePath, functionId) {
  const functionCodeDirectoryPath = getFunctionCodeDirectoryPath(functionId);
  return decompress(zipFilePath, functionCodeDirectoryPath);
}

export default unzipFunctionCode;
