const express = require('express')
const winston = require('winston')
const config = require('config')

global.rootPath = __dirname

const app = express()
require('./boot/exceptions')()
require('./boot/logging')()
require('./boot/mkdir')()
require('./boot/db')()
require('./boot/serverCerts')()
require('./events/cdrEvents')()
require('./boot/routes')(app)
require('./test/tesrtRunner')()

const port = config.get('server').port
app.listen(port, () => {
  winston.debug(`Server started on port ${port}`)
})
