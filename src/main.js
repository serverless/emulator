/* eslint-disable max-len */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';
import minimist from 'minimist';
import R from 'ramda';
import validateServiceName from './utils/validateServiceName';
import validateFunctionName from './utils/validateFunctionName';
import writeFunctionConfigFile from './utils/writeFunctionConfigFile';
import readFunctionConfigFile from './utils/readFunctionConfigFile';
import setupExecutionEnvironment from './utils/setupExecutionEnvironment';
import invokeFunction from './utils/invokeFunction';

async function run() {
  const app = new Koa();
  app.use(bodyParser());

  // use options if provided
  const argv = minimist(process.argv.slice(2));
  const options = R.omit(['_'], argv);
  const port = options.port || 8080;

  const functions = {
    deploy: async (ctx) => {
      const functionObj = ctx.request.body;
      const serviceName = validateServiceName(functionObj.serviceName);
      const functionName = validateFunctionName(functionObj.functionName);
      const functionConfig = functionObj.config;

      await writeFunctionConfigFile(functionConfig, serviceName, functionName);

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'deploy',
        data: ctx.request.body,
      };
    },

    invoke: async (ctx) => {
      const functionObj = ctx.request.body;
      const serviceName = validateServiceName(functionObj.serviceName);
      const functionName = validateFunctionName(functionObj.functionName);
      const payload = functionObj.payload;

      const functionConfig = await readFunctionConfigFile(serviceName, functionName);
      const spawnedProc = await setupExecutionEnvironment(serviceName, functionName, functionConfig);
      const output = await invokeFunction(spawnedProc, payload);

      const data = JSON.parse(output);

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'invoke',
        data,
      };
    },
  };

  app.use(router.post('/v0/emulator/api/functions', functions.deploy));
  app.use(router.post('/v0/emulator/api/functions/invoke', functions.invoke));

  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Serverless Local Emulator Daemon listening at localhost:${port}...`);
  });
}

run();
