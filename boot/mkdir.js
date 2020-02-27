const fs = require('fs-extra')
const path = require('path')
const config = require('config')

/**
 * Creates a directory to store logs if not already exists
 */
module.exports = function () {
  fs.mkdirsSync(path.join(global.rootPath, config.get('server').logsDirectory))
}
