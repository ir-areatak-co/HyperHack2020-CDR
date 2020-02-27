class HlfChannel {
  constructor (channelName, gateway) {
    gateway.getClient().then(client => {
      this.channel = client.getChannel(channelName)
    })
  }

  async getChannel (channelName, gateway) {
    const client = await gateway.getClient()
    const channel = client.getChannel(channelName)
    return channel
  }

  async getPeers (channelName, gateway) {
    const channel = await this.getChannel(channelName, gateway)
    const peers = channel.getPeers()
    return peers
  }
}

module.exports = HlfChannel
