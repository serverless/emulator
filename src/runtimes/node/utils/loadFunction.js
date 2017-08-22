import R from 'ramda';

export default function loadFunction(filePath, propPath) {
  const imported = require(filePath); // eslint-disable-line
  return propPath ? R.path(R.split('.', propPath), imported) : imported;
}
