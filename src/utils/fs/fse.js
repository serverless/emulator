const BbPromise = require('bluebird');
const fse = BbPromise.promisifyAll(require('fs-extra'));

export default fse;
