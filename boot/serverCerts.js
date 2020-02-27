const CdrChain = require('../network/CdrChain')
const SecureWallet = require('../utils/SecureWallet/secureWallet')
const config = require('config')
const winston = require('winston')

async function getAdminCaCert () {
  // ToDo: Check certificate that is valid with current CA
  const walletId = config.get('wallet').users.adminCA.walletId
  const walletPwd = config.get('wallet').users.adminCA.password
  let pki = await SecureWallet.get(walletId, walletPwd)
  if (pki) {
    winston.debug('Admin CA Cert has been generated before!')
    return
  }

  const cdrCA = new CdrChain.CA()

  pki = await cdrCA.enrollAdminCA()
  const key = Buffer.from(pki.key.toBytes())
  const cert = Buffer.from(pki.certificate)

  await SecureWallet.import(walletId, key, cert, walletPwd)

  winston.debug('Admin CA Cert generated Succesfully')
}

async function getServerAdminCert () {
  // ToDo: Check certificate that is valid with current CA
  const walletId = config.get('wallet').users.serverAdmin.walletId
  const walletPwd = config.get('wallet').users.serverAdmin.password
  let pki = await SecureWallet.get(walletId, walletPwd)
  if (pki) {
    winston.debug('Server Admin Cert has been generated before!')
    return
  }

  const regRequest = config.get('blockchain').registerRequests.serverAdmin
  const cdrCA = new CdrChain.CA()

  const secret = await cdrCA.registerUser(regRequest)

  pki = await cdrCA.enrollUser(regRequest.enrollmentID, secret)
  const key = Buffer.from(pki.key.toBytes())
  const cert = Buffer.from(pki.certificate)

  await SecureWallet.import(walletId, key, cert, walletPwd)

  winston.debug('Server Admin Cert generated Succesfully')
}

module.exports = async () => {
  await getAdminCaCert()
  await getServerAdminCert()
}
