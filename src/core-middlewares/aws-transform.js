import R from 'ramda';
import getRuntimeFileExtension from '../utils/getRuntimeFileExtension';

const preLoad = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'aws') {
    const fileExtension = getRuntimeFileExtension(payload.functionConfig.runtime);
    const handler = payload.functionConfig.handler;
    const pathToFuncFile = handler.split('/').slice(0, -1);

    transformedData.result.functionName = handler.split('/').pop();
    transformedData.result.functionFileName = `${pathToFuncFile}${fileExtension}`;
  }

  return Promise.resolve(transformedData);
};

const postLoad = (data) => {
  const transformedData = data;
  return Promise.resolve(transformedData);
};

const preInvoke = (data) => {
  const transformedData = R.clone(data);
  const { payload } = transformedData;

  if (payload.functionConfig.provider && payload.functionConfig.provider === 'aws') {
    const functionParams = {
      event: payload.payload,
      context: {},
    };

    transformedData.result = functionParams;
  }

  return Promise.resolve(transformedData);
};

const postInvoke = (data) => {
  const transformedData = R.clone(data);
  return Promise.resolve(transformedData);
};


export { preLoad, postLoad, preInvoke, postInvoke };
