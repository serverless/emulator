'use strict';

module.exports.helloWorld = (event, context, callback) => {
  return callback(null, {
    message: 'Hello World!',
    event,
    context,
  });
};
