const elliptic = require('elliptic')
const Signature = require('elliptic/lib/elliptic/ec/signature.js')
const EC = elliptic.ec
const crypto = require('crypto')
const forge = require('node-forge')

module.exports = class Sign {
  static signECDSA (digest, prvKeyObj) {
    if (!digest) {
      throw new Error('Invalid input data')
    }

    if (!prvKeyObj) {
      throw new Error('Private key must be specified')
    }

    const _ecdsaCurve = elliptic.curves[`p${prvKeyObj.ecparams.keylen}`]
    const _ecdsa = new EC(_ecdsaCurve)

    const signKey = _ecdsa.keyFromPrivate(prvKeyObj.prvKeyHex, 'hex')
    let signature = _ecdsa.sign(digest, signKey)
    signature = this._preventMalleability(signature, prvKeyObj.ecparams)
    const derSignature = signature.toDER()

    return Buffer.from(derSignature)
  }

  static signPKCS1 (
    tbs,
    key,
    tbsEncoding = 'utf8',
    algorithm = 'RSA-SHA1',
    signEncoding = 'base64'
  ) {
    const buffer = Buffer.from(tbs, tbsEncoding)
    const signer = crypto.createSign(algorithm)
    signer.update(buffer)
    const signature = signer.sign(key).toString(signEncoding)

    return signature
  }

  static signPKCS7 (
    tbs,
    certificate,
    key,
    tbsEncoding = 'base64',
    digestAlgorithm = 'sha1'
  ) {
    const p7 = forge.pkcs7.createSignedData()

    const buffer = Buffer.from(tbs, tbsEncoding)

    p7.content = forge.util.createBuffer(buffer)
    p7.addCertificate(certificate)
    p7.addSigner({
      key,
      certificate,
      digestAlgorithm: forge.pki.oids[digestAlgorithm]
    })
    p7.sign()
    let signedTBS = forge.pkcs7.messageToPem(p7)
    signedTBS = signedTBS.replace(/[\r\n]/g, '')
    signedTBS = signedTBS.replace('-----BEGIN PKCS7-----', '')
    signedTBS = signedTBS.replace('-----END PKCS7-----', '')

    return signedTBS
  }

  static verifySignECDSA (signature, digest, pubKeyObj) {
    if (!signature) {
      throw new Error('Invalid input signature')
    }
    if (!digest) {
      throw new Error('Invalid input data')
    }
    if (!pubKeyObj) {
      throw new Error('Invlaid input public key object')
    }

    if (!this._checkMalleability(signature, pubKeyObj.ecparams)) {
      throw new Error(
        'Invalid S value in signature. Must be smaller than half of the order.'
      )
    }

    const _ecdsaCurve = elliptic.curves[`p${pubKeyObj.ecparams.keylen}`]
    const _ecdsa = new EC(_ecdsaCurve)

    const pubKey = _ecdsa.keyFromPublic(pubKeyObj.pubKeyHex, 'hex')

    return pubKey.verify(digest, signature)
  }

  static verifySignPKCS1 (
    tbs,
    certificate,
    signature,
    tbsEncoding = 'utf8',
    algorithm = 'RSA-SHA1',
    signEncoding = 'base64'
  ) {
    algorithm = this._convertSignAlgorithm(algorithm)
    const buffer = Buffer.from(tbs, tbsEncoding)
    const verifier = crypto.createVerify(algorithm)
    verifier.update(buffer)
    const verified = verifier.verify(certificate, signature, signEncoding)

    return verified
  }

  static verifySignPKCS7 (
    tbs,
    messagePEM,
    tbsEncoding = 'base64',
    digestAlgorithm = 'sha1'
  ) {
    const message = forge.pkcs7.messageFromPem(messagePEM)
    const signature = message.rawCapture.signature
    const messageDigest = forge.md[digestAlgorithm].create()
    const buffer = Buffer.from(tbs, tbsEncoding)
    messageDigest.update(buffer)

    message.certificates[0].publicKey.verify(
      messageDigest.digest().bytes(),
      signature
    )
  }

  static _convertSignAlgorithm (algorithm) {
    if (algorithm === 'SHA1withRSA') {
      return 'RSA-SHA1'
    }
    if (algorithm === 'SHA224withRSA') {
      return 'RSA-SHA224'
    }
    if (algorithm === 'SHA256withRSA') {
      return 'RSA-SHA256'
    }
    if (algorithm === 'SHA384withRSA') {
      return 'RSA-SHA384'
    }
    if (algorithm === 'SHA512withRSA') {
      return 'RSA-SHA512'
    }
    if (algorithm === 'MD5withRSA') {
      return 'RSA-MD5'
    }
    return algorithm
  }

  static _getCurveOrders () {
    return {
      secp256r1: {
        halfOrder: elliptic.curves.p256.n.shrn(1),
        order: elliptic.curves.p256.n
      },
      secp384r1: {
        halfOrder: elliptic.curves.p384.n.shrn(1),
        order: elliptic.curves.p384.n
      }
    }
  }

  static _verifySlow (signature) {
    const startR = (signature[1] & 0x80) !== 0 ? 3 : 2
    const lengthR = signature[startR + 1]
    const startS = startR + 2 + lengthR
    const lengthS = signature[startS + 1]
    const S_HEX = signature.slice(startS + 2, startS + 2 + lengthS).toString('hex')

    return parseInt(S_HEX, 16) <= parseInt('0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
  }

  static _checkMalleability (sig, ecparams) {
    const curveOrders = this._getCurveOrders()
    const halfOrder = curveOrders[ecparams.name].halfOrder
    if (!halfOrder) {
      throw new Error(
        'Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' +
          ecparams.name
      )
    }

    // first need to unmarshall the signature bytes into the object with r and s values
    const sigObject = new Signature(sig, 'hex')
    if (!sigObject.r || !sigObject.s) {
      throw new Error('Failed to load the signature object from the bytes.')
    }

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it is considered invalid in this context
    if (sigObject.s.cmp(halfOrder) === 1) {
      // module 'bn.js', file lib/bn.js, method cmp()
      return false
    }

    return true
  };

  static _preventMalleability (sig, ecparams) {
    const curveOrders = this._getCurveOrders()
    const halfOrder = curveOrders[ecparams.name].halfOrder
    if (!halfOrder) {
      throw new Error(
        'Can not find the half order needed to calculate "s" value for immalleable signatures. Unsupported curve name: ' +
          ecparams.name
      )
    }

    // in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
    // first see if 's' is larger than half of the order, if so, it needs to be specially treated
    if (sig.s.cmp(halfOrder) === 1) {
      // module 'bn.js', file lib/bn.js, method cmp()
      // convert from BigInteger used by jsrsasign Key objects and bn.js used by elliptic Signature objects
      const bigNum = curveOrders[ecparams.name].order
      sig.s = bigNum.sub(sig.s)
    }

    return sig
  }
}
