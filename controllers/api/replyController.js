const db = require('../../models')
const Reply = db.Reply

const replyService = require('../../services/replyService')

const replyController = {
  // create new reply
  createReply: (req, res) => {
    replyService.createReply(req, res, (data) => {
      return res.json(data)
    })
  },
  // get replies
  getReply: (req, res) => {
    replyService.getReply(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = replyController