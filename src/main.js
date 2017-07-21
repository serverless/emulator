/* eslint-disable import/first */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';
import {
  validateFunction,
  createFunctionDirectory,
  unzip,
  createFunctionJson,
  loadFunctionJson,
  loadAwsEnvVars,
  invokeNode,a
} from './utils/utils';

const HOSTNAME = 'localhost';
const PORT = 8080;

async function run() {
  const app = new Koa();
  app.use(bodyParser());

  const functions = {
    deploy: async (ctx) => {
      const functionObj = ctx.request.body;
      const serviceName = functionObj.serviceName;
      const functionName = functionObj.functionName;
      const funcConfig = functionObj.config;
      const zipFile = functionObj.zipFile;

      const expectedProps = ['serviceName', 'functionName', 'config'];
      validateFunction(functionObj, expectedProps);

      const funcDirPath = await createFunctionDirectory(serviceName, functionName);
      const unzippedContent = await unzip(zipFile, serviceName, functionName);
      const funcJsonPath = await createFunctionJson(funcDirPath, funcConfig);

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'deploy',
        data: ctx.request.body,
      };
    },

    invoke: async (ctx) => {
      const functionObj = ctx.request.body;
      const serviceName = functionObj.serviceName;
      const functionName = functionObj.functionName;
      const payload = functionObj.payload;

      const expectedProps = ['serviceName', 'functionName'];
      validateFunction(functionObj, expectedProps);

      const funcConfig = await loadFunctionJson(serviceName, functionName);
      const envObj = await loadAwsEnvVars(funcConfig);
      const output = await invokeNode(serviceName, functionName, payload)

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
