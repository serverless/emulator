import R from 'ramda';
import loadCoreMiddlewares from './loadCoreMiddlewares';

export default async function loadMiddlewares(hook) {
  const middlewares = await loadCoreMiddlewares();
  return R.reject(R.isNil, R.map(middleware => middleware.functions[hook], middlewares));
}
