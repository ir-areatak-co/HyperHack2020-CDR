const CdrChain = require('../network/CdrChain')
const config = require('config')

const handler = (event, blockNumber, transactionId, status) => {
  const data = {
    ...JSON.parse(event.payload.toString()),
    startCallAcceptTnx: {
      transactionId,
      blockNumber,
      status
    }
  }
  console.log(data)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').callStartAccepted
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
