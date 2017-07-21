const fse = require('./fse');

function removeFile(filePath) {
  return fse.removeAsync(filePath);
}

export default removeFile;
