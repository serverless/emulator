/* eslint-disable import/first */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';

import validateServiceName from './utils/validateServiceName';
import validateFunctionName from './utils/validateFunctionName';
import writeFunctionConfigFile from './utils/writeFunctionConfigFile';
import readFunctionConfigFile from './utils/readFunctionConfigFile';

const HOSTNAME = 'localhost';
const PORT = 8080;

async function run() {
  const app = new Koa();
  app.use(bodyParser());

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
      // const envObj = await loadAwsEnvVars(funcConfig);
      // const output = await invokeNode(serviceName, functionName, payload)

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'invoke',
        data: ctx.request.body,
      };
    },
  };

  app.use(router.post('v0/emulator/api/functions', functions.deploy));
  app.use(router.post('v0/emulator/api/functions/invoke', functions.invoke));

  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Serverless Local Emulator Daemon listening at ${HOSTNAME}:${PORT}...`);
  });
}

run();
