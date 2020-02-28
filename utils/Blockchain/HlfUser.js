class HlfUser {
  constructor (enrollmentId, key, cert, mspId) {
    this.User = {
      enrollmentId,
      key,
      cert,
      mspId
    }
  }
}

module.exports = HlfUser
