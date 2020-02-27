const { Gateway } = require('fabric-network')

class HlfGateway {
  constructor (connectionPath, wallet) {
    this._connectionPath = connectionPath
    this._wallet = wallet
  }

  async createForUser (enrollmentId) {
    const gateway = new Gateway()
    await gateway.connect(this._connectionPath, {
      wallet: this._wallet,
      identity: enrollmentId,
      discovery: { enabled: false }
    })

    return gateway
  }
}

module.exports = HlfGateway
