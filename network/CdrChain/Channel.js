const CdrGateway = require('./Gateway')
const Hlf = require('../../utils/Blockchain')
const config = require('config')

class CdrChannel {
  static async getChannel (channelName) {
    const walletId = config.get('wallet').users.serverAdmin.walletId
    const walletPwd = config.get('wallet').users.serverAdmin.password

    const cdrGateway = new CdrGateway()
    const gateway = await cdrGateway.createGatewayForUser(walletId, walletPwd, 'Org1MSP')

    const channel = await Hlf.Channel.getChannel(channelName, gateway)
    return channel
  }

  static async getChannelEvents (chaincodeName, eventName, channelName, handler, errorHandler) {
    const channel = await this.getChannel(channelName)

    const peers = channel.getPeers()
    const channelEventHub = channel.getChannelEventHub(peers[0].getPeer().getName())

    await channelEventHub.registerChaincodeEvent(chaincodeName, eventName, handler, errorHandler, {
      replay: true,
      startBlock: 0
    })

    channelEventHub.connect(true, (error, channelEventHub) => {
      if (error) console.log(error)
    })
    channelEventHub.checkConnection(true)
  }
}

module.exports = CdrChannel
