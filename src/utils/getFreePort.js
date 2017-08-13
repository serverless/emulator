import portfinder from 'portfinder';

function getFreePort(basePort) {
  portfinder.basePort = basePort;
  return portfinder.getPortPromise();
}

export default getFreePort;
