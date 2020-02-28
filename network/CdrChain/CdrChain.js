const Hlf = require('../../utils/Blockchain')
const SecureWallet = require('../../utils/SecureWallet/secureWallet')
const Network = require('./Network')
const CdrGateway = require('./Gateway')
const Config = require('Config')

class CdrCA {
  constructor () {
    this.CdrNetwork = new Network()

    this.caInfo = this.CdrNetwork.getCaInfo()
    this.ca = new Hlf.CA(this.caInfo)
  }

  async getAdminCaPki () {
    const adminWalletId = Config.get('wallet.users.adminCA.walletId')
    const adminWalletPwd = Config.get('wallet.users.adminCA.password')
    const adminCaPki = await SecureWallet.get(adminWalletId, adminWalletPwd)
    return adminCaPki
  }

  async enrollAdminCA () {
    const adminCa = this.CdrNetwork.getAdminCa()
    const enrollment = await this.ca.enrollAdminCA(adminCa)
    return enrollment
  }

  async registerUser (regRequest) {
    const adminCaWalletId = Config.get('wallet.users.adminCA.walletId')
    const adminCaWalletPwd = Config.get('wallet.users.adminCA.password')

    const cdrgateway = new CdrGateway()
    const gateway = await cdrgateway.createGatewayForUser(adminCaWalletId, adminCaWalletPwd, 'Org1MSP')

    const secret = await this.ca.registerUser(regRequest, gateway)
    return secret
  }

  async enrollUser (enrollmentID, enrollmentSecret, csr = null) {
    const enrollment = await this.ca.enrollUser(enrollmentID, enrollmentSecret, csr)
    return enrollment
  }

  async revokeUser (enrollmentId, revocationReason) {
    const adminCaWalletId = Config.get('wallet.users.adminCA.walletId')
    const adminCaWalletPwd = Config.get('wallet.users.adminCA.password')

    const cdrgateway = new CdrGateway()
    const gateway = await cdrgateway.createGatewayForUser(adminCaWalletId, adminCaWalletPwd, 'Org1MSP')

    const revocation = await this.ca.revokeUser(enrollmentId, revocationReason, gateway)
    return revocation
  }

  async softRevokeUser (certificate, revocationReason) {
    const adminCaWalletId = Config.get('wallet.users.adminCA.walletId')
    const adminCaWalletPwd = Config.get('wallet.users.adminCA.password')

    const cdrgateway = new CdrGateway()
    const gateway = await cdrgateway.createGatewayForUser(adminCaWalletId, adminCaWalletPwd, 'Org1MSP')

    const revocation = await this.ca.softRevokeUser(certificate, revocationReason, gateway)
    return revocation
  }

  async getCrl (restrictFilter) {
    const adminCaWalletId = Config.get('wallet.users.adminCA.walletId')
    const adminCaWalletPwd = Config.get('wallet.users.adminCA.password')

    const cdrgateway = new CdrGateway()
    const gateway = await cdrgateway.createGatewayForUser(adminCaWalletId, adminCaWalletPwd, 'Org1MSP')

    const crl = await this.ca.getCrl(restrictFilter, gateway)
    return crl
  }
}

module.exports = CdrCA
