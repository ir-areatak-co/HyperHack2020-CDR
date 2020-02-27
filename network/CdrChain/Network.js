const Hlf = require('../../utils/Blockchain')
const config = require('config')
const fs = require('fs')

class CdrNetwork {
  constructor () {
    this.network = config.get('blockchain').network

    const connectinPath = config.get(`blockchain.networks.${this.network}.connectionPath`)
    this.connectinProfile = JSON.parse(fs.readFileSync(connectinPath).toString())
  }

  getCaInfo () {
    return Hlf.Connection.getCaInfo(this.connectinProfile)
  }

  getAdminCa () {
    return config.get(`blockchain.networks.${this.network}.adminCA.enrollment`)
  }
}

module.exports = CdrNetwork
