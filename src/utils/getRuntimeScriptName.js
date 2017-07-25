function getRuntimeScriptName(runtime) {
  if (runtime.match(/python/)) {
    return 'python.py';
  }
  return 'node.js';
}

export default getRuntimeScriptName;
