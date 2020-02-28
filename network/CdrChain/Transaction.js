const Hlf = require('../../utils/Blockchain')
const CdrGateway = require('./Gateway')
const config = require('config')

class CdrTranaction {
  async evaluate(gateway, channelName, contractName, functionName, args) {
    const walletId = config.get('wallet').users.serverAdmin.walletId
    const walletPwd = config.get('wallet').users.serverAdmin.password

    const cdrGateway = new CdrGateway()
    const gateway = await cdrGateway.createGatewayForUser(walletId, walletPwd, 'Org1MSP')

    const result = await Hlf.Transaction.evaluate(gateway, channelName, contractName, functionName, args)
    return result
  }

  async submit (gateway, channelName, contractName, functionName, args) {
    const walletId = config.get('wallet').users.serverAdmin.walletId
    const walletPwd = config.get('wallet').users.serverAdmin.password

    const cdrGateway = new CdrGateway()
    const gateway = await cdrGateway.createGatewayForUser(walletId, walletPwd, 'Org1MSP')

    const result = await Hlf.Transaction.submit(gateway, channelName, contractName, functionName, args)
    return result
  }
}