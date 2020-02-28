const CdrChain = require('../network/CdrChain')
const CallEventsDao = require('../DAO/callEvents')
const config = require('config')
const winston = require('winston')

const handler = async (event, blockNumber, transactionId, status) => {
  const data = {
    ...JSON.parse(event.payload.toString()),
    startCallCreateTnx: {
      transactionId,
      blockNumber,
      status
    }
  }
  await CallEventsDao.upsert(data)
  winston.debug(`event: START_CREATED, TnxId: ${transactionId}, BLOCK; ${blockNumber}`)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').callStartCreated
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
