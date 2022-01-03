const helper = require('../_helpers')
const db = require('../models')
const Reply = db.Reply

const replyService = {
  // create new reply
  createReply: (req, res, callback) => {
    if(!req.body.comment) return callback({status: 'error', message: '請輸入推文回覆'})
    Reply.create({
      comment: req.body.comment,
      UserId: helper.getUser(req).id,
      TweetId: req.params.tweet_id
    }).then(reply => {
      return callback({status: 'success', message: '成功新增推文回覆'})
    })
  },
  // get replies
  getReply: (req, res, callback) => {
    Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      raw: true,
      nest: true
    }).then(replies => {
      return callback({ replies: replies })
    })
  }
}

module.exports = replyService