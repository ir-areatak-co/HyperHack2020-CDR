const CallEvents = require('../models/CallEvents')

module.exports = class CallEventsDao {
  static async get(query) {
    const result = CallEvents.findOne(query)
    return result
  }

  static async getAll(query, fields) {
    const result = CallEvents.find(query).select(fields)
    return result
  }

  static async getMany(query, limit, offset) {
    const result = CallEvents.find(query)
      .skip(offset)
      .limit(limit)
    return result
  }

  static async getCounts(query) {
    const result = CallEvents.find(query).count()
    return result
  }

  static async getCountsByGroup(field) {
    const result = CallEvents.aggregate([
      { $match: { senderOperator: 'UsaOpServer' } },
      { $group: { _id: 'senderOperator', total: { $sum: 1 } } }
    ])
    return result
  }

  static async insert(data) {
    try {
      const callEvent = await CallEvents(data)
      const result = await callEvent.save()
      return result
    } catch (ex) {
      throw new Error(ex.errmsg)
    }
  }

  static async update(data) {
    try {
      const callEvent = await CallEvents.findOne({ callId: data.callId })
      if (callEvent) {
        await callEvent.updateOne(data)
        return callEvent
      }

      return null
    } catch (ex) {
      throw new Error(ex.errmsg)
    }
  }

  static async upsert(data) {
    try {
      let callEvent = await CallEvents.findOne({ callId: data.callId })
      if (callEvent) {
        await callEvent.updateOne(data)
        return callEvent
      }

      callEvent = await CallEvents(data)
      const result = await callEvent.save()
      return result
    } catch (ex) {
      throw new Error(ex.errmsg)
    }
  }
}
