let containerNumber = 0

function getContainerKey(runtime, functionId) {
  containerNumber++;
  return `${runtime}+${functionId}+${containerNumber}`;
}

export default getContainerKey;
