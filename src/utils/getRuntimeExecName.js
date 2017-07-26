function getRuntimeExecName(runtime) {
  if (runtime.match(/python/)) {
    return 'python';
  }
  return 'node';
}

export default getRuntimeExecName;
