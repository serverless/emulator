function getRuntimeFileExtension(runtime) {
  if (runtime.match(/python/)) {
    return '.py';
  }
  return '.js';
}

export default getRuntimeFileExtension;
