import path from 'path';
import R from 'ramda';
import fse from '../utils/fs/fse';

async function loadCoreMiddlewares() {
  const coreMiddlewaresDir = path.join(__dirname, '..', 'core-middlewares');

  return fse.readdirAsync(coreMiddlewaresDir)
    .then((files) => {
      const middlewares = R.filter(file => file.endsWith('.js'), files);

      // sort by name (ascending)
      middlewares.sort();

      return R.map((middleware) => {
        // eslint-disable-next-line
        const required = require(path.join(coreMiddlewaresDir, middleware));

        return {
          name: middleware.replace('.js', ''),
          functions: required,
        };
      }, middlewares);
    });
}

export default loadCoreMiddlewares;
