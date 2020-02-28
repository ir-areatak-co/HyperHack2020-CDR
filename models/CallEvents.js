const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true, sparse: true },
  blockNumber: { type: String, required: true },
  status: { type: String, required: true }
}, { _id: false })

const callSchema = new mongoose.Schema({
  callId: { type: String, required: true, unique: true },
  senderOperator: { type: String, required: true },
  receiverOperator: { type: String, required: true },
  callerId: { type: String, required: true },
  callReceiverId: { type: String, required: true },
  startedAt: { type: String, required: true },
  endedAt: { type: String, required: false },
  duration: { type: Number, required: false },
  status: { type: String, required: true },
  startCallCreateTnx: { type: TransactionSchema, required: true },
  startCallAcceptTnx: { type: TransactionSchema, required: false },
  endCallTnx: { type: TransactionSchema, required: false }
})

const CallEvents = mongoose.model('CallEvents', callSchema)

module.exports = CallEvents
