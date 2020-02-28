const getCalls = require('./getCalls')
const getStats = require('./getStats')
const router = require('express').Router()

router.get('/stats', getStats)
router.post('/:page/:pageSize', getCalls)

module.exports = router
