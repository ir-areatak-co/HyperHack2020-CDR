const CallEventsDao = require('../../DAO/callEvents')

module.exports = async (req, resp) => {
  // total calls
  await CallEventsDao.getCounts({})

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
  const usaDurations = await CallEventsDao.getAll({ senderOperator: 'UsaOpServer', status: 'ENDED' }, 'duration')
  console.log(usaDurations);
  
  const usaDuration = usaDurations.reduce((a, b) => a.duration || 0 + b.duration || 0)
  const indiaDurations = await CallEventsDao.getAll({ senderOperator: 'IndiaOpServer', status: 'ENDED' }, 'duration')
  console.log(indiaDurations);
  
  const indiaDuration = indiaDurations.reduce((a, b) => a.duration || 0 + b.duration || 0)

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
