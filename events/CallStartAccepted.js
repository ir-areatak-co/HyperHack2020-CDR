const CdrTransaction = require('../network/CdrChain/Transaction')
const CdrChain = require('../network/CdrChain')
const CallEventsDao = require('../DAO/callEvents')
const config = require('config')
const winston = require('winston')

async function endCall(callId) {
  const functionName = config.get('transactions').endCall.name
  const chaincode = config.get('transactions').endCall.chaincode
  const channel = config.get('transactions').endCall.channel
  const args = [callId]

  try {
    const call = await CallEventsDao.get({ callId })
    if (call.senderOperator === config.get('server').name && call.status === 'START_ACCEPTED') {
      const result = await CdrTransaction.submit(channel, chaincode, functionName, args)
    }
  } catch (ex) {
    winston.error(ex.message)
  }
}

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

  // for testRunner only: End call
  await endCall(data.callId)
}

const errorHandler = error => console.log(error)

module.exports = async () => {
  const { name, chaincode, channel } = config.get('events').callStartAccepted
  await CdrChain.Channel.getChannelEvents(chaincode, name, channel, handler, errorHandler)
}
