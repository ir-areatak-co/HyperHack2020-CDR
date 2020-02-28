const CdrTransaction = require('../network/CdrChain/Transaction')
const config = require('config')
const randToken = require('rand-token').generator({ chars: 'numeric' })

module.exports = () => {
  const functionName = config.get('transactions').createCallStart.name
  const chaincode = config.get('transactions').createCallStart.chaincode
  const channel = config.get('transactions').createCallStart.channel

  setInterval(async () => {
    const senderOperator = config.get('server').name === 'IndiaOpServerAdmin' ? 'UsaOpServerAdmin' : 'IndiaOpServerAdmin'
    const callerId = randToken.generate(10)
    const callReceiverId = randToken.generate(10)
    const startedAt = `${Date.now()}`
    const args = [senderOperator, callerId, callReceiverId, startedAt]

    const result = await CdrTransaction.submit(channel, chaincode, functionName, args)    
  }, 10000)
}