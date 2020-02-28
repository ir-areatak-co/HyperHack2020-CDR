const crypto = require('crypto')
const jsSHA3 = require('js-sha3')
const { sha3_384 } = jsSHA3

module.exports = class Hash {
  static _hash_sh2_256 (data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
  }

  static _hash_sha2_384 (data) {
    return crypto
      .createHash('sha384')
      .update(data)
      .digest('hex')
  }

  static _hash_sha3_256 (data) {
    return sha3_256(data)
  }

  static _hash_sha3_384 (data) {
    return sha3_384(data)
  }

  static hashMessgae (data, algorithm) {
    if (!data) {
      throw new Error('Invalid input data')
    }

    if (algorithm === 'SHA2_256') return this._hash_sha2_256(data)
    else if (algorithm === 'SHA2_384') return this._hash_sha2_384(data)
    else if (algorithm === 'SHA3_256') return this._hash_sha3_256(data)
    else if (algorithm === 'SHA3_384') return this._hash_sha3_384(data)
    else throw new Error('invlaid hash algorithm')
  }

  static verifyHash (data, hashed, algorithm) {
    if (!data) {
      throw new Error('Invalid input data')
    }

    if (!hashed) throw new Error('Invalid hashed message')

    let _hashed
    if (algorithm === 'SHA2_256') _hashed = this._hash_sha2_256(data)
    else if (algorithm === 'SHA2_384') _hashed = this._hash_sha2_384(data)
    else if (algorithm === 'SHA3_256') _hashed = this._hash_sha3_256(data)
    else if (algorithm === 'SHA3_384') _hashed = this._hash_sha3_384(data)
    else throw new Error('invlaid hash algorithm')

    return (_hashed === hashed)
  }
}
