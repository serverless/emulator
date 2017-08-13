let containerNumber = 0

function getContainerKey(runtime, serviceName, functionName) {
  containerNumber++;
  return `${runtime}+${serviceName}+${functionName}+${containerNumber}`;
}

export default getContainerKey;
