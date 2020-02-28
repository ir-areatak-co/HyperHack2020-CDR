const pem = require('./pem/pem')

module.exports = class Pkcs12 {
  static decode (pfx, password) {
    return new Promise((resolve, reject) => {
      pem.readPkcs12(pfx, { p12Password: password }, (err, cert) => {
        if (err) return reject(err)
        resolve(cert)
      })
    })
  }

  static encode (key, cert, password) {
    return new Promise((resolve, reject) => {
      pem.createPkcs12(key, cert, password, (err, pkcs12) => {
        if (err) return reject(err)
        resolve(pkcs12.pkcs12)
      })
    })
  }
}
