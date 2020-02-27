const express = require('express')
const winston = require('winston')

global.rootPath = __dirname

const app = express()
require('./boot/logging')()
require('./boot/mkdir')()
require('./boot/db')()

const port = process.env.server_port
app.listen(port, () => {
  winston.debug(`Server started on port ${port}`)
})
