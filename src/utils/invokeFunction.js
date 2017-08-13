/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

import stringify from 'node-stringify';
import BbPromise from 'bluebird';
import runMiddlewares from './runMiddlewares';

async function invokeFunction(functionId, functionConfig, container, payload) {
  const { stdin, stdout, stderr } = container.process;
  const preInvokeInput = { functionId, functionConfig, payload };
  const preInvokeOutput = await runMiddlewares('preInvoke', preInvokeInput);

  // use stringify module here to preserve the callback function
  const stdinPayload = String(stringify(preInvokeOutput));

  // send payload to runtime
  stdin.setEncoding('utf-8');
  stdin.write(stdinPayload);
  stdin.end();

  const errorData = await getErrorData(stderr);
  const outputData = await getOutputData(stdout);

  const postInvokeInput = { functionId, functionConfig, payload, errorData, outputData };
  const postInvokeOutput = await runMiddlewares('postInvoke', postInvokeInput);

  if (errorData) {
    let error;
    try {
      error = JSON.parse(postInvokeOutput.errorData);
    } catch (e) {
      error = postInvokeOutput.errorData;
    }
    return error;
  }

  let result;
  try {
    result = JSON.parse(postInvokeOutput.outputData);
  } catch (e) {
    result = postInvokeOutput.outputData;
  }
  container.close();
  return result;
}

// helper functions
async function getErrorData(stderr) {
  return new BbPromise((resolve) => {
    const chunks = [];
    stderr.on('data', chunk => chunks.push(chunk));
    stderr.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}

async function getOutputData(stdout) {
  return new BbPromise((resolve) => {
    const chunks = [];
    stdout.on('data', chunk => chunks.push(chunk));
    stdout.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}

export default invokeFunction;
