const Cert = require('../Cryptography/cert')
const parseCRL = require('../Cryptography/parseCRL')
const FabricCAServices = require('fabric-ca-client')

class HlfCA {
  constructor (caInfo) {
    this._caService = new FabricCAServices(caInfo)
  }

  async enrollAdminCA (adminCaEnrollment) {
    try {
      const enrollment = await this._caService.enroll(adminCaEnrollment)
      return enrollment
    } catch (error) {
      throw new Error(`Failed to enroll admin user "admin": ${error}`)
    }
  }

  async registerUser (regRequest, gateway) {
    const ca = gateway.getClient().getCertificateAuthority()
    const caUserIdentity = gateway.getCurrentIdentity()

    const secret = await ca.register(regRequest, caUserIdentity)

    gateway.disconnect()

    return secret
  }

  async enrollUser (enrollmentID, enrollmentSecret, csr = null) {
    let enrollmentRequest = {
      enrollmentID,
      enrollmentSecret
    }
    enrollmentRequest = csr ? { ...enrollmentRequest, csr } : enrollmentRequest

    const enrollment = await this._caService.enroll(enrollmentRequest)

    return enrollment
  }

  async revokeUser (enrollmentId, revokationReason, gateway) {
    const ca = gateway.getClient().getCertificateAuthority()
    const caUserIdentity = gateway.getCurrentIdentity()

    const revokeResult = await ca.revoke(
      {
        enrollmentID: enrollmentId,
        reason: revokationReason
      },
      caUserIdentity
    )

    gateway.disconnect()

    return revokeResult.result
  }

  async softRevokeUser (certificate, revokationReason, gateway) {
    const ca = gateway.getClient().getCertificateAuthority()
    const caUserIdentity = gateway.getCurrentIdentity()

    const certInfo = Cert.parseCertificate(certificate)
    const aki = certInfo.getExtAuthorityKeyIdentifier().kid
    const serialNumber = certInfo.getSerialNumberHex()

    const revokeResult = await ca.revoke({
      aki,
      serial: serialNumber,
      reason: revokationReason
    },
    caUserIdentity
    )

    gateway.disconnect()

    return revokeResult.result
  }

  async getCrl (restrictFilter, gateway) {
    const ca = gateway.getClient().getCertificateAuthority()
    const caUserIdentity = gateway.getCurrentIdentity()

    const crl = await ca.generateCRL(restrictFilter, caUserIdentity)
    const parsedCRL = parseCRL(crl)

    gateway.disconnect()

    return parsedCRL
  }
}

module.exports = HlfCA
