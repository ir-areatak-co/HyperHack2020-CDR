const CdrChain = require('../network/CdrChain')
const SecureWallet = require('../utils/SecureWallet/secureWallet')
const config = require('config')

async function getAdminCaCert () {
  const cdrCA = new CdrChain.CA()

  const pki = await cdrCA.enrollAdminCA()
  const key = Buffer.from(pki.key.toBytes())
  const cert = Buffer.from(pki.certificate)

  const walletId = config.get('wallet').users.adminCA.walletId
  const walletPwd = config.get('wallet').users.adminCA.password
  await SecureWallet.import(walletId, key, cert, walletPwd)
}

async function getServerAdminCert () {
  const regRequest = config.get('blockchain').registerRequests.serverAdmin
  const cdrCA = new CdrChain.CA()

  const secret = await cdrCA.registerUser(regRequest)

  const pki = await cdrCA.enrollUser(regRequest.enrollmentID, secret)
  const key = Buffer.from(pki.key.toBytes())
  const cert = Buffer.from(pki.certificate)

  const walletId = config.get('wallet').users.serverAdmin.walletId
  const walletPwd = config.get('wallet').users.serverAdmin.password
  await SecureWallet.import(walletId, key, cert, walletPwd)
}

module.exports = async () => {
  await getAdminCaCert()
  await getServerAdminCert()
}
