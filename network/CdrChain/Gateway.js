const Hlf = require('../../utils/Blockchain')
const CdrWallet = require('./Wallet')
const CdrNetwork = require('./Network')

class CdrGateway {
  constructor () {
    this._cdrWallet = new CdrWallet()
  }

  async createGatewayForUser (enrollmentId, password, mspId) {
    const cdrNetwork = new CdrNetwork()
    await this._cdrWallet.importIdentity(enrollmentId, password, mspId)

    const gateway = new Hlf.Gateway(cdrNetwork.connectinProfile, this._cdrWallet.wallet)
    const userGateway = await gateway.createForUser(enrollmentId)

    return userGateway
  }
}

module.exports = CdrGateway
