class HlfChannel {
  static async getChannel (channelName, gateway) {
    const client = await gateway.getClient()
    const channel = client.getChannel(channelName)
    return channel
  }

  static async getPeers (channelName, gateway) {
    const channel = await this.getChannel(channelName, gateway)
    const peers = channel.getPeers()
    return peers
  }
}

module.exports = HlfChannel
