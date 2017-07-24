import YAML from 'js-yaml';

function parse(filePath, contents) {
  if (filePath.endsWith('.json')) {
    return JSON.parse(contents);
  } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
    return YAML.load(contents.toString(), { filename: filePath });
  }
  return contents.toString().trim();
}

export default parse;
