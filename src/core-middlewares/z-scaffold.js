// this is an example / scaffold to show how the middlewares concept works

import R from 'ramda';

const preLoad = async (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postLoad = async (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const preInvoke = async (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postInvoke = async (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

export { preLoad, postLoad, preInvoke, postInvoke };
