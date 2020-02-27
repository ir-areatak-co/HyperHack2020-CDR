const path = require('path')
const winston = require('winston')
const { timestamp, printf } = winston.format

/**
 * Configure directory and format of logs for error, info and debug log levels
 */
module.exports = function () {
  const errorFormatter = printf(error => {
    let stack = ''
    if (error.stack) {
      stack = error.stack.replace(/[\r\n]+/g, '')
    }

    return `{"timestamp":"${error.timestamp}", "level":"${error.level}", "message":"${error.message}", "stack":"${stack}"}`
  })

  const consoleFormatter = printf(error => `${error.level}: ${error.message}`)

  winston.add(
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      format: winston.format.combine(timestamp(), errorFormatter),
      level: 'error'
    })
  )

  winston.add(
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/info.log'),
      format: winston.format.combine(timestamp(), errorFormatter),
      level: 'info'
    })
  )

  winston.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        consoleFormatter
      )
    })
  )
}
