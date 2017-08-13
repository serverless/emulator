const portfinder = require('portfinder');
function getFreePort(baseport) {
  portfinder.baseport = baseport;
  return portfinder.getPortPromise();
}

export default getFreePort;
