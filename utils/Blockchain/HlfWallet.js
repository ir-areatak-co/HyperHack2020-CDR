const HlfIdentity = require('./HlfIdentity')
const { InMemoryWallet } = require('fabric-network')

class HlfWallet {
  constructor () {
    this.wallet = new InMemoryWallet()
  }

  async importIdentity (enrollmentId, key, cert, mspId) {
    this.wallet = await this.deleteIdentity(enrollmentId, this.wallet)

    const userIdentity = HlfIdentity.createIdentity(key, cert, mspId)

    await this.wallet.import(enrollmentId, userIdentity)

    return this.wallet
  }

  async existsIdentity (enrollmentId) {
    const exists = await this.wallet.exists(enrollmentId)
    return exists
  }

  async listIdentities () {
    const identities = await this.wallet.list()
    return identities
  }

  async deleteIdentity (enrollmentId) {
    const userExists = await this.wallet.exists(enrollmentId)
    if (!userExists) return this.wallet

    await this.wallet.delete(enrollmentId)
    return this.wallet
  }
}

module.exports = HlfWallet
