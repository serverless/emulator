import fsExtra from 'fs-extra';
import BbPromise from 'bluebird';

const fse = BbPromise.promisifyAll(fsExtra);

export default fse;
