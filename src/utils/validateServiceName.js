function validateServiceName(serviceName) {
  if (typeof serviceName !== 'string') {
    throw Error('invalid service name');
  }
  return serviceName;
}

export default validateServiceName;
