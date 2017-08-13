function validateFunctionId(functionId) {
  if (typeof functionId !== 'string') {
    throw Error('invalid function id');
  }
  return functionId;
}

export default validateFunctionId;
