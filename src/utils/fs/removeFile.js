import fse from './fse';

function removeFile(filePath) {
  return fse.removeAsync(filePath);
}

export default removeFile;
