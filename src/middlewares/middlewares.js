import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
import R from 'ramda';

const fsp = Promise.promisifyAll(fs);

async function loadCoreMiddlewares() {
  const coreMiddlewaresDir = path.join(__dirname, 'core-middlewares');

  return fsp.readdirAsync(coreMiddlewaresDir)
    .then((files) => {
      const middlewares = R.filter(file => file.endsWith('.js'), files);

      return R.map((middleware) => {
        // eslint-disable-next-line
        const required = require(path.join(coreMiddlewaresDir, middleware));

        return {
          name: middleware.replace('.js', ''),
          functions: required,
        };
      }, middlewares);
    });
}

// TODO implement
async function loadCustomMiddlewares() {
  return [];
}

async function loadAllMiddlewares() {
  let middlewares = [];

  const coreMiddlewares = await loadCoreMiddlewares();
  const customMiddlewares = await loadCustomMiddlewares();

  middlewares = R.union(coreMiddlewares, customMiddlewares);

  return middlewares;
}

async function runMiddlewares(middlewares, hook, data, middlewaresToRun) {
  if (!middlewaresToRun || middlewaresToRun.length === 0) {
    middlewaresToRun = middlewares; // eslint-disable-line
  } else {
    middlewaresToRun = R.filter(middleware => R.contains(middleware.name, middlewaresToRun), middlewares); // eslint-disable-line
  }

  return Promise.mapSeries(middlewaresToRun, (middleware) => { // eslint-disable-line
    if (middleware.functions[hook]) return middleware.functions[hook](data);
  }).then(res => res[res.length - 1]); // TODO remove this hack to only return the last element
}

export {
  loadAllMiddlewares,
  loadCoreMiddlewares,
  loadCustomMiddlewares,
  runMiddlewares,
};
