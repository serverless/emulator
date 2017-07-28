// this is an example / scaffold to show how the middlewares concept works

import R from 'ramda';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postLoad = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const preInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
