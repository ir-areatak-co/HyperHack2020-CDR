const CdrChain = require('../network/CdrChain')
const CallEventsDao = require('../DAO/callEvents')
const config = require('config')
const winston = require('winston')

const handler = async (event, blockNumber, transactionId, status) => {
  const data = {
    ...JSON.parse(event.payload.toString()),
    status: 'START_ACCEPTED',
    startCallAcceptTnx: {
      transactionId,
      blockNumber,
      status
    }
  }
  await CallEventsDao.update(data)
  winston.debug(`event: START_ACCEPTED, TnxId: ${transactionId}, BLOCK; ${blockNumber}`)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').callStartAccepted
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
