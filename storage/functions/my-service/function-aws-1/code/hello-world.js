module.exports.helloWorld = (event, context, callback) => callback(null, {
  message: 'Hello World!',
  event,
  context,
  env: process.env,
});
