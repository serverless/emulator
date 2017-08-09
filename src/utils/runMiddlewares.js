import BbPromise from 'bluebird';
import R from 'ramda';
import loadCoreMiddlewares from './loadCoreMiddlewares';

async function runMiddlewares(hook, data, middlewaresArr) {
  const middlewares = await loadCoreMiddlewares();

  let middlewaresToRun;
  if (!middlewaresArr || middlewaresArr.length === 0) {
    middlewaresToRun = middlewares;
  } else {
    middlewaresToRun = R.filter(middleware =>
      R.contains(middleware.name, middlewaresArr), middlewares);
  }

  // prepare the data which is passed into the middlewares so that they have a common shape
  // the shape is { input: <contains-old-values>, output: <place-to-store-new-values> }
  let clonedData = R.clone(data);
  clonedData.input = { ...clonedData };
  clonedData.output = {};
  clonedData = R.pick(['input', 'output'], clonedData);

  return BbPromise.reduce(middlewaresToRun, (transformedData, middleware) => {
    if (middleware.functions[hook]) {
      return middleware.functions[hook](transformedData);
    }
    return BbPromise.resolve(transformedData);
  }, clonedData).then(transformedData => transformedData.output);
}

export default runMiddlewares;
