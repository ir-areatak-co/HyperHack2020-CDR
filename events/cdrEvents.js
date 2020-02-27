const CdrChain = require('../network/CdrChain')
const config = require('config')

const handler = (event, blockNumber, transactionId, status) => {
  console.log(event.payload.toString())
  console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').profileRegistered
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
