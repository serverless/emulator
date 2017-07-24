import BbPromise from 'bluebird';
import fileExists from './fileExists';
import readFile from './readFile';

const readFileIfExists = function (filePath) {
  return fileExists(filePath)
    .then((exists) => {
      if (!exists) {
        return BbPromise.resolve(false);
      }
      return readFile(filePath);
    });
};

export default readFileIfExists;
