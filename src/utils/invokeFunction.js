import BbPromise from 'bluebird';

async function invokeFunction(proc, payload) {
  const { stdin, stdout } = proc;

  // send payload to runtime
  stdin.setEncoding('utf-8');
  stdin.write(JSON.stringify(payload));
  stdin.end();

  return new BbPromise((resolve, reject) => {
    const chunks = [];
    stdout.on('data', chunk => chunks.push(chunk));

    stdout.on('end', () => {
      const result = Buffer.concat(chunks).toString();
      return resolve(result);
    });

    stdout.on('error', error => reject(error));
  });
}

export default invokeFunction;
