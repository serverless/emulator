exports.helloWorld = (event, callback) => callback(null, {
  message: 'Hello World!',
  event,
  env: process.env,
});
