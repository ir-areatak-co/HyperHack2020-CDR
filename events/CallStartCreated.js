const CdrTransaction = require('../network/CdrChain/Transaction')
const CdrChain = require('../network/CdrChain')
const CallEventsDao = require('../DAO/callEvents')
const config = require('config')
const winston = require('winston')

async function acceptCall(callId) {
  const functionName = config.get('transactions').acceptCallStart.name
  const chaincode = config.get('transactions').acceptCallStart.chaincode
  const channel = config.get('transactions').acceptCallStart.channel
  const args = [callId]

  try {
    const call = await CallEventsDao.get({ callId: data.callId })
    if (call.senderOperator === config.get('server').name && call.status === 'START_CREATED') {
      const result = await CdrTransaction.submit(channel, chaincode, functionName, args)
    }
  } catch (ex) {
    winston.error(ex.message)
  }
}

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

  // for testRunner only: accept call
  await acceptCall(data.callId)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').callStartCreated
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
