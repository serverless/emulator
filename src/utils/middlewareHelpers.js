import path from 'path';

function getPathToFunctionFile(handler) {
  return handler.split('.')[0].replace(/\//g, path.sep);
}

function getFunctionName(handler) {
  return handler.split('.')[1];
}

export { getPathToFunctionFile, getFunctionName };
