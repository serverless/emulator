function validateRuntime(runtime) {
  if (!runtime.match(/node/)) {
    throw Error(`Runtime "${runtime}" currently not supported`);
  }
  return runtime;
}

export default validateRuntime;
