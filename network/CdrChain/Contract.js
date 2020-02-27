const Hlf = require('../../utils/Blockchain')
const CdrGateway = require('./Gateway')
const config = require('config')

class CdrContract {
  constructor (chaincodeName, channelName) {
    const walletId = config.get('wallet').users.serverAdmin.walletId
    const walletPwd = config.get('wallet').users.serverAdmin.password

    const cdrGateway = new CdrGateway()
    cdrGateway.createGatewayForUser(walletId, walletPwd, 'Org1MSP')
      .then(gateway => {
        this.hlfContract = new Hlf.Contract(chaincodeName, channelName, gateway)
      })
      .catch(ex => {
        throw new Error(ex)
      })
  }

  async getContractEvents (eventListenerName, eventName, handler, options) {
    await this.hlfContract.getContractEvents(eventListenerName, eventName, handler, options)
  }
}

module.exports = CdrContract
