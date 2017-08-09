require('babel-polyfill');
require('babel-register')({
  ignore: false,
  babelrc: false,
  presets: [
    'stage-0',
    'stage-1',
    'stage-2',
    'stage-3',
  ],
});
require('./main');
