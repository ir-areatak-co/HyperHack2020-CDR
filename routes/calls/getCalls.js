const callsDao = require('../../DAO/callEvents')

module.exports = async (req, resp) => {
  const page = +req.params.page
  const pageSize = +req.params.pageSize
  const filter = req.params.filter

  const calls = await callsDao.getMany(filter, page, pageSize)

  return resp.status(200).send({ calls })
}
