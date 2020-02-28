const callStartCreated = require('./CallStartCreated')
const callStartAccepted = require('./CallStartAccepted')
const callEnded = require('./CallEnded')

module.exports = async () => {
  await callStartCreated()
  await callStartAccepted()
  await callEnded()
}
