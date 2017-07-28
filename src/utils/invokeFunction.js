/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

import BbPromise from 'bluebird';
import runMiddlewares from './runMiddlewares';

async function invokeFunction(serviceName, functionName, functionConfig, proc, payload) {
  const { stdin, stdout, stderr } = proc;

  const preInvokePayload = { serviceName, functionName, functionConfig, payload };
  const preInvokeResult = await runMiddlewares('preInvoke', preInvokePayload);

  const serializedPayload = JSON.stringify(preInvokeResult);

  // send payload to runtime
  stdin.setEncoding('utf-8');
  stdin.write(serializedPayload);
  stdin.end();

  const errorData = await getErrorData(stderr);
  const outputData = await getOutputData(stdout);

  const postInvokePayload = { serviceName, functionName, functionConfig, payload, errorData, outputData };
  const postInvokeResult = await runMiddlewares('postInvoke', postInvokePayload);

  if (errorData) {
    return postInvokeResult.errorData;
  }

  return JSON.parse(postInvokeResult.outputData);
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
