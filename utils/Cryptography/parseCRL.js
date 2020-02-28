const helper = require('./helper')
const pkijs = require('pkijs')
const asn1js = require('asn1js')

module.exports = class Crl {
  static parseCrl (crl) {
    const crlBuf = Buffer.from(crl, 'base64')
    let crlPEM = crlBuf.toString('utf8')

    // remove header and footer
    crlPEM = helper.unwrapPEM(crlPEM)

    // decode crl-PEM to byte Array
    let crlBuffer = Buffer.from(crlPEM, 'base64')
    crlBuffer = new Uint8Array(crlBuffer).buffer

    const crlAsn1 = asn1js.fromBER(crlBuffer)

    const CertificateRevocationList = pkijs.CertificateRevocationList
    const decodedCrl = new CertificateRevocationList({
      schema: crlAsn1.result
    })

    if (!decodedCrl.revokedCertificates) return []

    const revokedCerts = decodedCrl.revokedCertificates.map(cert => {
      return {
        serialNumber: this._buf2hex(
          cert.userCertificate.valueBlock.valueHex
        ),
        revokedDate: cert.revocationDate.value
      }
    })

    return revokedCerts
  }

  static _buf2hex (buffer) {
    // buffer is an ArrayBuffer
    return Array.prototype.map
      .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
      .join('')
  }
}
