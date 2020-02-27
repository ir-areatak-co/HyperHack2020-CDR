const Hlf = require('../../utils/Blockchain')
const SecureWallet = require('../../utils/SecureWallet/secureWallet')

class CdrWallet {
  constructor () {
    this._hlfWallet = new Hlf.Wallet()
    this.wallet = this._hlfWallet.wallet
  }

  async importIdentity (enrollmentId, password, mspId) {
    const userPki = await SecureWallet.get(enrollmentId, password)
    this.wallet = await this._hlfWallet.importIdentity(enrollmentId, userPki.key, userPki.cert, mspId)

    return this.wallet
  }

  async existsIdentity (enrollmentId) {
    this.wallet = this._hlfWallet.existsIdentity(enrollmentId)
    return this.wallet
  }

  async listIdentities () {
    this.wallet = this._hlfWallet.listIdentities()
    return this.wallet
  }

  async deleteIdentity (enrollmentId) {
    this.wallet = this._hlfWallet.deleteIdentity(enrollmentId)
    return this.wallet
  }
}

module.exports = CdrWallet
