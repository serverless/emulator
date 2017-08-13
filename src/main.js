/* eslint-disable max-len */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';
import minimist from 'minimist';
import R from 'ramda';
import validateFunctionId from './utils/validateFunctionId';
// import validateZipFilePath from './utils/validateZipFilePath';
// import unzipFunctionCode from './utils/unzipFunctionCode';
import copyDirContentsSync from './utils/fs/copyDirContentsSync';
import getFunctionCodeDirectoryPath from './utils/getFunctionCodeDirectoryPath';
import writeFunctionConfigFile from './utils/writeFunctionConfigFile';
import readFunctionConfigFile from './utils/readFunctionConfigFile';
import setupExecutionEnvironment from './utils/setupExecutionEnvironment';
import invokeFunction from './utils/invokeFunction';

process.title = 'Serverless Local Emulator';

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
    deploy: async (ctx) => {
      const { functionId, functionConfig } = ctx.request.body;
      validateFunctionId(functionId);

      const functionCodeDirectoryPath = getFunctionCodeDirectoryPath(functionId);

      copyDirContentsSync(functionConfig.servicePath, functionCodeDirectoryPath);
      // await unzipFunctionCode(zipFilePath, functionId);
      await writeFunctionConfigFile(functionConfig, functionId);

      console.log(`Function deployed: ${functionId}`); // eslint-disable-line

      ctx.response.type = 'json';
      ctx.body = ctx.request.body;
    },

    invoke: async (ctx) => {
      const { payload, functionId } = ctx.request.body;

      const functionConfig = await readFunctionConfigFile(functionId);
      const spawnedProc = await setupExecutionEnvironment(functionId, functionConfig);
      const result = await invokeFunction(functionId, functionConfig, spawnedProc, payload);

      ctx.response.type = 'json';
      ctx.body = result;
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

  app.use(router.post('/v0/emulator/api/function/deploy', functions.deploy));
  app.use(router.post('/v0/emulator/api/function/invoke', functions.invoke));
  app.use(router.post('/v0/emulator/api/utils/heartbeat', utils.heartbeat));

  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Local Emulator listening on: http://localhost:${port}`);
  });
}

run();
