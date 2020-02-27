const jsrsa = require('jsrsasign')
const asn1 = jsrsa.asn1
const sign = require('./sign')
const hash = require('./hash')
const helper = require('./helper')

module.exports = class Csr {
  static async generateCSR (subject, keypair) {
    const subjectDN = helper.subjectToLdap(subject)

    const csri = new asn1.csr.CertificationRequestInfo()
    csri.setSubjectByParam({ str: subjectDN })
    csri.setSubjectPublicKeyByGetKey(keypair.pubKeyObj.pubKeyPem)

    const csr = new asn1.csr.CertificationRequest({ csrinfo: csri })

    csr.asn1SignatureAlg = new asn1.x509.AlgorithmIdentifier({
      name: 'SHA256withECDSA'
    })

    const digest = await hash.hashMessgae(
      Buffer.from(csr.asn1CSRInfo.getEncodedHex(), 'hex'),
      'SHA2_256'
    )

    const signature = await sign.signEDCSA(
      Buffer.from(digest, 'hex'),
      keypair.prvKeyObj
    )
    csr.hexSig = signature.toString('hex')

    csr.asn1Sig = new asn1.DERBitString({ hex: '00' + csr.hexSig })
    const seq = new asn1.DERSequence({
      array: [csr.asn1CSRInfo, csr.asn1SignatureAlg, csr.asn1Sig]
    })
    csr.hTLV = seq.getEncodedHex()
    csr.isModified = false

    const csrPEM = csr.getPEMString()

    return csrPEM
  }

  static CSRinfo (csr) {
    if (!csr) {
      throw new Error('CSR must be specified')
    }

    const csrInfo = asn1.csr.CSRUtil.getInfo(csr)
    const subject = helper.ldapToSubject(csrInfo.subject.name)
    return subject
  }
}
