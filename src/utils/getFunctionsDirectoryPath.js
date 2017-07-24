import path from 'path';
import os from 'os';

// TODO should be overrideable via emulator config
function getFunctionsDirectoryPath() {
  return path.join(os.homedir(), '.serverless', 'local-emulator', 'storage', 'functions');
}

export default getFunctionsDirectoryPath;
