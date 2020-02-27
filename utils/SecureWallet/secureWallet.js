const pkcs12 = require('../Cryptography/pkcs12')
const fs = require('fs')
const path = require('path')
const config = require('config')

module.exports = class SecureWallet {
  static async get (id, password) {
    const fileName = `${id}.pfx`
    const pkiPath = path.join(config.get('wallet').walletPath, fileName)

    try {
      const encodedPki = fs.readFileSync(pkiPath)
      const pki = await pkcs12.decode(encodedPki, password)
      return pki
    } catch (ex) {
      return null
    }
  }

  static async import (id, key, cert, password) {
    const fileName = `${id}.pfx`
    const pkiPath = path.join(config.get('wallet').walletPath, fileName)

    const adminPKI = await pkcs12.encode(key, cert, password)
    fs.writeFileSync(pkiPath, adminPKI)
  }
}
