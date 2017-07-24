import fse from './fse';
import parse from './parse';

async function readFile(filePath) {
  return fse.readFileAsync(filePath, 'utf8')
    .then(contents => parse(filePath, contents));
}

export default readFile;
