class HlfContract {
  constructor (chaincodeName, channelName, gateway) {
    gateway.getNetwork(channelName)
      .then(network => {
        this.contract = network.getContract(chaincodeName)
      })
      .catch(ex => {
        throw new Error(ex)
      })
  }

  async getContractEvents (eventListenerName, eventName, handler, options) {
    await this.contract.addContractListener(eventListenerName, eventName, handler, options)
  }
}

module.exports = HlfContract
