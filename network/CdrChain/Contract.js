const Hlf = require('../../utils/Blockchain')
const CdrGateway = require('./Gateway')
const config = require('config')

class CdrContract {
  constructor (chaincodeName, channelName) {
    this.chaincodeName = chaincodeName
    this.channelName = channelName
  }

  async getContract () {
    const walletId = config.get('wallet').users.serverAdmin.walletId
    const walletPwd = config.get('wallet').users.serverAdmin.password

    const cdrGateway = new CdrGateway()
    const gateway = await cdrGateway.createGatewayForUser(walletId, walletPwd, 'Org1MSP')
    // const channel = await gateway.getNetwork('mychannel')
    // const contract = channel.getContract('profile')

    const client = await gateway.getClient()
    const channel = client.getChannel('mychannel')
    return channel
  }

  async getContractEvents (eventListenerName, eventName, handler, errorHandler) {
    const channel = await this.getContract()
    console.log(channel)

    const peers = channel.getPeers()
    const channelEventHub = channel.getChannelEventHub(peers[0].getPeer().getName())

    await channelEventHub.registerChaincodeEvent(this.chaincodeName, eventName, handler, errorHandler, {
      replay: true,
      startBlock: 0
    })

    channelEventHub.connect(true, (error, channelEventHub) => {
      console.log(error)
    })
    channelEventHub.checkConnection(true)

    // await contract.addContractListener(eventListenerName, eventName, handler)
  }
}

module.exports = CdrContract
