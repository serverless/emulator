let containerNumber = 0;

function getContainerKey(runtime, functionId) {
  containerNumber += 1;
  return `${runtime}+${functionId}+${containerNumber}`;
}

export default getContainerKey;
