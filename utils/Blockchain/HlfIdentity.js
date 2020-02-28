const { X509WalletMixin } = require('fabric-network')

class HlfIdentity {
  static createIdentity (key, cert, mspId) {
    return X509WalletMixin.createIdentity(mspId, cert, key)
  }
}

module.exports = HlfIdentity
