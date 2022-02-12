const helper = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship, Notice } = db

const replyService = {
  // create new reply
  createReply: async (req, res, callback) => {
    try {
      if (!req.body.comment) return callback({ status: 'error', message: '請輸入推文回覆' })
      const reply = await Reply.create({
        comment: req.body.comment,
        UserId: helper.getUser(req).id,
        TweetId: req.params.tweet_id
      })
      console.log(reply.id, reply.comment)
      let currentUserId = Number(helper.getUser(req).id)
      const followers = await User.findByPk(helper.getUser(req).id, {
        include: [{ model: User, as: 'Followers' }]
      })
      for (user of followers.Followers) {
        let roomName = helper.createPrivateRoom(Number(user.id), currentUserId)
        await Notice.create({
          roomName: roomName,
          isRead: false,
          ReplyId: reply.id,
          UserId: user.id,
        })
      }
      return callback({ status: 'success', message: '成功新增推文回覆', reply: reply })
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '無法回覆此篇推文'})
    }
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