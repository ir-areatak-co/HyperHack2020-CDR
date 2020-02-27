const CdrChain = require('../network/CdrChain')
const SecureWallet = require('../../app/Utils/SecureWallet/secureWallet')
const config = require('config')

async function getAdminCaCert () {
  const maskanCA = new CdrChain.CA()

  const pki = await maskanCA.enrollAdminCA()
  const key = Buffer.from(pki.key.toBytes())
  const cert = Buffer.from(pki.certificate)

  const walletId = config.get('wallet').users.adminCA.walletId
  const walletPwd = config.get('wallet').users.adminCA.password
  await SecureWallet.import(walletId, key, cert, walletPwd)
}

async function getServerAdminCert () {
  const regRequest = config.get('blockchain.registerRequests.maskanAdmin')
  const maskanCA = new CdrChain.CA()

  const secret = await maskanCA.registerUser(regRequest)

  const pki = await maskanCA.enrollUser(regRequest.enrollmentID, secret)
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
