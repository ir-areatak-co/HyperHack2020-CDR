const forge = require('node-forge')

module.exports = length => {
  const keypair = forge.pki.rsa.generateKeyPair(length)

  const prvKeyObj = {
    prvKeyPem: forge.pki.privateKeyToPem(keypair.privateKey)
  }

  const pubKeyObj = {
    pubKeyPem: forge.pki.publicKeyToPem(keypair.publicKey)
  }

  return {
    prvKeyObj,
    pubKeyObj
  }
}
