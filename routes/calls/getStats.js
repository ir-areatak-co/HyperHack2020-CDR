const CallEventsDao = require('../../DAO/callEvents')

module.exports = async (req, resp) => {
  // total calls
  await callsDao.getCounts({})

  // total calls (by each)
  const totalUsaCalls = await CallEventsDao.getCounts({ senderOperator: 'UsaOpServer' })
  const totalIndiaCalls = await CallEventsDao.getCounts({ senderOperator: 'IndiaOpServer' })

  // total start created calls (by each)
  const totalUsaCallsStarted = await CallEventsDao.getCounts({ senderOperator: 'UsaOpServer', status: 'START_CREATED' })
  const totalIndiaCallsStarted = await CallEventsDao.getCounts({ senderOperator: 'IndiaOpServer', status: 'START_CREATED' })

  // total start accepted calls (by each)
  const totalUsaCallsStartAccepted = await CallEventsDao.getCounts({ senderOperator: 'UsaOpServer', status: 'START_ACCEPTED' })
  const totalIndiaCallsStartAccepted = await CallEventsDao.getCounts({ senderOperator: 'IndiaOpServer', status: 'START_ACCEPTED' })

  // total ended calls (by each)
  const totalUsaCallsEnded = await CallEventsDao.getCounts({ senderOperator: 'UsaOpServer', status: 'ENDED' })
  const totalIndiaCallsEnded = await CallEventsDao.getCounts({ senderOperator: 'IndiaOpServer', status: 'ENDED' })

  // total call duration (by each)
  const usaDurations = await CallEventsDao.getMany({ senderOperator: 'UsaOpServer', status: 'ENDED' }, 'duration')
  const usaDuration = usaDurations.reduce((a, b) => a + b)
  const indiaDurations = await CallEventsDao.getMany({ senderOperator: 'IndiaOpServer', status: 'ENDED' }, 'duration')
  const indiaDuration = indiaDurations.reduce((a, b) => a + b)

  return resp.status(200).send({
    totalIndiaCalls,
    totalIndiaCallsEnded,
    totalIndiaCallsStartAccepted,
    totalIndiaCallsStarted,
    indiaDuration,
    totalUsaCalls,
    totalUsaCallsEnded,
    totalUsaCallsStartAccepted,
    totalUsaCallsStarted,
    usaDuration
  })
}
