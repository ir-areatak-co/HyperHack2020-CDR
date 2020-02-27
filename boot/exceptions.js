const winston = require('winston')

module.exports = () => {
  /**
   * Log uncaught exceptions at error level
   */
  process.on('uncaughtException', ex => {
    winston.error({ message: ex.message, stack: ex.stack })
  })

  /**
   * Throw error at unhandled rejections
   */
  process.on('unhandledRejection', ex => {
    throw new SyntaxError(ex)
  })
}
