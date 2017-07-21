'use strict';

import path from 'path';
import writeFile from './fs/writeFile';

/**
 * params
 *   functionObj - object
 *     serviceName - string
 *     functionName - string
 *     config - object
 *       handler - string
 *       provider - string
 *       [provider-related-config]
 *   expectedObj - object
 *     param1 - any
 *     ...
 * return functionObj
 */
function validateFunction() {
  return null;
}

/**
 * params
 *   serviceName - string
 *   functionName - string
 * return Promise(functionDirectoryPath)
  */
async function writeFunctionJsonFile(functionConfig, serviceName, functionName) {
  const functionsDirPath = '';
  const functionConfigFilePath = path.join(functionsDirPath,
    serviceName, functionName, 'function.json');

  return writeFile(functionConfigFilePath, functionConfig);
}

/**
 * params
 *   zipFile - buffer
 *   serviceName - string
 *   functionName - string
 * return Promise(pathToUnzippedContent)
*/
async function unzip() {
  return Promise.resolve();
}

/**
 * params
 *   functionDirectoryPath - string
 *   functionConfig - object
 * return Promise(pathToFunctionJson)
 */
async function createFunctionJson() {
  return Promise.resolve();
}

/**
 * params
 *   serviceName - string
 *   functionName - string
 * return Promise(functionConfig)
*/
async function loadFunctionJson() {
  return Promise.resolve();
}

/**
 * params
 *   functionConfig - object
 * return environmentObject
 */
async function loadAwsEnvVars() {
  return Promise.resolve();
}

/**
 * params
 *   serviceName - string
 *   functioName - string
 *   payload - object
 * return Promise(stdOutput)
 */
async function invokeNode() {
  return Promise.resolve();
}

export {
  validateFunction,
  createFunctionDirectory,
  unzip,
  createFunctionJson,
  loadFunctionJson,
  loadAwsEnvVars,
  invokeNode,
};
