const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

module.exports = async function () {
  const host = config.get('database').host
  const port = config.get('database').port
  const dbName = config.get('database').name

  const db = `mongodb://${host}:${port}/${dbName}`

  await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  winston.debug('App Connected to Database Succesfully')
}
