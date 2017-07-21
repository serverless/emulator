import R from 'ramda';

const preInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};

export { preInvoke, postInvoke };
