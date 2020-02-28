const rsasign = require('jsrsasign')
const sign = require('./sign')
const helper = require('./helper')

module.exports = class Cert {
  getSubject (certificatePEM) {
    const certificate = new rsasign.X509()
    certificatePEM = helper.wrapCertificate(certificatePEM)
    try {
      certificate.readCertPEM(certificatePEM)
    } catch (error) {
      throw new Error('Invalid certificate format')
    }
    return helper.ldapToSubject(certificate.getSubjectString())
  }

  parse (certificatePEM) {
    const certificate = new rsasign.X509()
    try {
      certificate.readCertPEM(certificatePEM)
      return certificate
    } catch (error) {
      throw new Error('Invalid certificate format')
    }
  }

  verify (userCertificate, CACertificate) {
    let hTbsCert, algorithm, CASignature
    const certificate = new rsasign.X509()
    try {
      certificate.readCertPEM(userCertificate)
      // Check certificate expiration date
      if (
        Date.now() < rsasign.zulutodate(certificate.getNotBefore()) ||
        Date.now() > rsasign.zulutodate(certificate.getNotAfter())
      ) {
        throw new Error('Expired certificate')
      }
      // Check CA signature in user certificate
      hTbsCert = rsasign.ASN1HEX.getTLVbyList(certificate.hex, 0, [0])
      algorithm = certificate.getSignatureAlgorithmField()
      CASignature = certificate.getSignatureValueHex()
    } catch (error) {
      throw new Error('Invalid user certificate format')
    }
    const verified = sign.verifySignPKCS1(hTbsCert, CACertificate, CASignature, 'hex', algorithm, 'hex')

    if (!verified) {
      throw new Error('Certificate not signed by CA')
    }
  }
}
