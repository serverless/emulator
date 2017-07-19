/* eslint-disable import/first */

import Koa from 'koa';
import router from 'koa-route';
import bodyParser from 'koa-bodyparser';

const HOSTNAME = 'localhost';
const PORT = 8080;

async function run() {
  const app = new Koa();
  app.use(bodyParser());

  const functions = {
    deploy: async (ctx) => {
      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'deploy',
        data: ctx.request.body,
      };
    },

    invoke: async (ctx) => {
      ctx.response.type = 'json';
      ctx.body = {
        resource: 'functions',
        method: 'invoke',
        data: ctx.request.body,
      };
    },
  };

  app.use(router.post('/functions', functions.deploy));
  app.use(router.post('/functions/invoke', functions.invoke));

  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Serverless Local Emulator Daemon listening at ${HOSTNAME}:${PORT}...`);
  });
}

run();
