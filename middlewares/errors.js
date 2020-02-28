const winston = require('winston')

module.exports = function (err, req, res, next) {
  winston.error({
    message: err.message + ' on ' + req.originalUrl,
    stack: err.stack
  })
  if (
    err instanceof ReferenceError ||
    err instanceof SyntaxError ||
    err instanceof TypeError
  ) {
    res.statusCode = 500
    res.json({ message: 'Server error occurred' })
  } else {
    res.statusCode = 400
    res.json({ message: err.message })
  }
  next()
}
