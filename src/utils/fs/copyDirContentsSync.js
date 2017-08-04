'use strict';

import fse from './fse';
import path from 'path';
import walkDirSync from './walkDirSync';

function copyDirContentsSync(srcDir, destDir) {
  const fullFilesPaths = walkDirSync(srcDir);

  fullFilesPaths.forEach(fullFilePath => {
    const relativeFilePath = fullFilePath.replace(srcDir, '');
    fse.copySync(fullFilePath, path.join(destDir, relativeFilePath));
  });
}

export default copyDirContentsSync;
