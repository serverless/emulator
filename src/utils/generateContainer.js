import R from 'ramda';
import validateRuntime from './validateRuntime';
import getContainerKey from './getContainerKey';
import loadContainer from './loadContainer';

let containers = {};

export default async function generateContainer(functionId, functionConfig, containerConfig) {
  const { runtime } = functionConfig;
  validateRuntime(runtime);

  const key = getContainerKey(runtime, functionId);
  if (R.has(key, containers)) {
    return R.prop(key, containers);
  }

  const container = await loadContainer(functionId, functionConfig, containerConfig);
  container.on('error', (error) => {
    console.error(`Unexpected error in container ${error}`);
    container.close();
  });
  container.on('close', () => {
    containers = R.dissoc(key, containers);
  });

  containers = R.assoc(key, container, containers);
  return container;
}
