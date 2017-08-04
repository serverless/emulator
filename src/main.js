/* eslint-disable max-len */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';
import minimist from 'minimist';
import R from 'ramda';
import validateServiceName from './utils/validateServiceName';
import validateFunctionName from './utils/validateFunctionName';
// import validateZipFilePath from './utils/validateZipFilePath';
// import unzipFunctionCode from './utils/unzipFunctionCode';
import copyDirContentsSync from './utils/fs/copyDirContentsSync';
import getFunctionDirectoryPath from './utils/getFunctionDirectoryPath';
import writeFunctionConfigFile from './utils/writeFunctionConfigFile';
import readFunctionConfigFile from './utils/readFunctionConfigFile';
import setupExecutionEnvironment from './utils/setupExecutionEnvironment';
import invokeFunction from './utils/invokeFunction';

async function run() {
  const app = new Koa();
  app.use(bodyParser());

  // global error-handling middleware
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  });

  // use options if provided
  const argv = minimist(process.argv.slice(2));
  const options = R.omit(['_'], argv);
  const port = options.port || 4002;

  const functions = {
    deploy: async (ctx, service, fn) => {
      const requestBody = ctx.request.body;
      const serviceName = validateServiceName(service);
      const functionName = validateFunctionName(fn);
      // const zipFilePath = validateZipFilePath(requestBody.zipFilePath);
      const functionConfig = requestBody;

      const functionDirectoryPath = getFunctionDirectoryPath(service, fn);

      copyDirContentsSync(functionConfig.servicePath, functionDirectoryPath);
      // await unzipFunctionCode(zipFilePath, serviceName, functionName);
      await writeFunctionConfigFile(functionConfig, serviceName, functionName);

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'deploy',
        data: ctx.request.body,
      };
    },

    invoke: async (ctx, service, fn) => {
      const requestBody = ctx.request.body;
      const serviceName = validateServiceName(service);
      const functionName = validateFunctionName(fn);
      const payload = requestBody.payload;

      const functionConfig = await readFunctionConfigFile(serviceName, functionName);
      const spawnedProc = await setupExecutionEnvironment(serviceName, functionName, functionConfig);
      const result = await invokeFunction(serviceName, functionName, functionConfig, spawnedProc, payload);

      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'invoke',
        data: result,
      };
    },
  };

  const utils = {
    heartbeat: async (ctx) => {
      const ping = ctx.request.body.ping;
      const timestamp = (+new Date());

      ctx.response.type = 'json';
      ctx.body = {
        pong: ping,
        timestamp,
      };
    },
  };

  app.use(router.post('/v0/emulator/api/deploy/:service/:fn', functions.deploy));
  app.use(router.post('/v0/emulator/api/invoke/:service/:fn', functions.invoke));
  app.use(router.post('/v0/emulator/api/utils/heartbeat', utils.heartbeat));

  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Serverless Local Emulator Daemon listening at localhost:${port}...`);
  });
}

run();
