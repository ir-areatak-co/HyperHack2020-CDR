const getCalls = require('./getCalls')
const getStats = require('./getStats')
const router = require('express').Router

router.get('/stats', getCalls)
router.post('/:page/:pageSize', getStats)

module.exports = router
