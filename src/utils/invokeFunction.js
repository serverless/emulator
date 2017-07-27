import BbPromise from 'bluebird';
import runMiddlewares from './runMiddlewares';

async function invokeFunction(serviceName, functionName, functionConfig, proc, payload) {
  const { stdin, stdout } = proc;

  const preInvokePayload = { serviceName, functionName, functionConfig, payload };
  const preInvokeResult = await runMiddlewares('preInvoke', preInvokePayload);

  const serializedPayload = JSON.stringify(preInvokeResult);

  // send payload to runtime
  stdin.setEncoding('utf-8');
  stdin.write(serializedPayload);
  stdin.end();

  return new BbPromise((resolve, reject) => {
    const chunks = [];
    stdout.on('data', chunk => chunks.push(chunk));

    stdout.on('end', () => {
      const result = Buffer.concat(chunks).toString();

      // TODO const postInvokeResult = await runMiddlewares('postInvoke', postInvokePayload);

      const deserializedResult = JSON.parse(result);
      return resolve(deserializedResult);
    });

    stdout.on('error', error => reject(error));
  });
}

export default invokeFunction;
