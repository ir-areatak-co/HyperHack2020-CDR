class HlfTransaction {
  async evaluate (gateway, channelName, contractName, functionName, args) {
    const network = await gateway.getNetwork(channelName)

    const contract = await network.getContract(contractName)

    const responseBuffer = await contract.evaluateTransaction(
      functionName,
      ...args
    )

    return responseBuffer
  }

  async submit (gateway, channelName, contractName, functionName, args) {
    const network = await gateway.getNetwork(channelName)

    const contract = await network.getContract(contractName)

    const responseBuffer = await contract.submitTransaction(
      functionName,
      ...args
    )

    return responseBuffer
  }
}

module.exports = HlfTransaction
