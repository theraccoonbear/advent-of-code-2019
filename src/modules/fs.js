const cbfs = require('fs');
const util = require('util');

module.exports =  {
  readdir: util.promisify(cbfs.readdir),
  readFile: util.promisify(cbfs.readFile),
  writeFile: util.promisify(cbfs.writeFile),
};