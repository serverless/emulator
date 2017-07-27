function validateZipFilePath(zipFilePath) {
  if (typeof zipFilePath === 'string' && zipFilePath.endsWith('.zip')) {
    return zipFilePath;
  }
  throw Error('invalid .zip file path');
}

export default validateZipFilePath;
