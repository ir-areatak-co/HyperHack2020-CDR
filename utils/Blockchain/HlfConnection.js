class HlfConnection {
  static getCaInfo (connectioProfile) {
    const orgName = connectioProfile.client.organization
    const caInfo =
        connectioProfile.certificateAuthorities[
          connectioProfile.organizations[orgName].certificateAuthorities
        ]
    return caInfo
  }
}

module.exports = HlfConnection
