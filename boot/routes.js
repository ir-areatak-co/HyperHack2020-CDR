const calls = require('../routes/calls')
const errors = require('../middlewares/errors')
const bodyParser = require('body-parser')
const cors = require('cors')
require('express-async-errors')

module.exports = async function (app) {
  app.use(cors())
  app.use(bodyParser.json())

  app.use('/calls', calls)
  app.use(errors)
}
