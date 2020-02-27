module.exports = class Helper {
  static wrapCertificate (certificate) {
    if (!certificate.startsWith('-----BEGIN CERTIFICATE-----')) {
      certificate =
        '-----BEGIN CERTIFICATE-----\n' +
        certificate +
        '\n-----END CERTIFICATE-----'
    }
    return certificate
  }

  static unwrapCertificate (certificate) {
    certificate = certificate
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .trim()

    return certificate
  }

  static unwrapPem (pem) {
    pem = pem.replace(/^-----BEGIN.*?-----/, '')
    pem = pem.replace(/-----END.*?-----$/, '')
    return pem
  }

  static ldapToSubject (ldap) {
    const ldapFields = ldap.split('/')

    const subject = {}
    for (const field of ldapFields) {
      if (field.length > 0) {
        const data = field.split('=')
        subject[data[0]] = data[1]
      }
    }

    return subject
  }

  static subjectToLdap (subject) {
    const subjectKeys = Object.keys(subject)
    let subjectDN = ''

    for (const k of subjectKeys) {
      subjectDN = `${subjectDN}/${k}=${subject[k]}`
    }

    return subjectDN
  }

  static privateKeyHexToPem (privateKey) {
    const beginingString = '-----BEGIN PRIVATE KEY-----\n'
    const endingString = '\n-----END PRIVATE KEY-----'
    const keyBase64 = Buffer.from(privateKey).toString('base64')
    const pemKey = beginingString + keyBase64 + endingString
    return pemKey
  }

  static publicKeyHexToPem (publicKey) {
    const beginingString = '-----BEGIN PUBLIC KEY-----\n'
    const endingString = '\n-----END PUBLIC KEY-----'
    const keyBase64 = Buffer.from(publicKey).toString('base64')
    const pemKey = beginingString + keyBase64 + endingString
    return pemKey
  }
}
