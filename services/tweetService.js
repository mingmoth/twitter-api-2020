const helper = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like, Notice } = db

const tweetService = {
  // get all tweets
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [ User, Reply, Like ]
    }).then(tweets => {
      tweets = tweets.map(tweet => {
        return tweet = {
          ...tweet.dataValues,
          Replies: tweet.Replies.length,
          Likes: tweet.Likes.length,
          isLiked: tweet.Likes.map(d => d.UserId).includes(helper.getUser(req).id)
        }
      })
      callback({tweets: tweets})
    })
  },
  // get one tweet
  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.id,
      { include: [ User,
        { model: Reply,  include: [User] },
        { model: Like }
      ]}).then(tweet => {
        tweet = {
          ...tweet.dataValues,
          isLiked: tweet.Likes.map(d => d.UserId).includes(helper.getUser(req).id)
        }
       callback({tweet: tweet})
    })
  },
  // create new tweet
  createTweet: async (req, res, callback) => {
    if (!req.body.description) return callback({status: 'error', message: '請輸入推文內容'})
    if(req.body.description.length > 140) return callback({status: 'error', message: '推文字數需小於140單位'})
    let currentUserId = Number(helper.getUser(req).id)
    try {
      const tweet = await Tweet.create({
        description: req.body.description,
        UserId: helper.getUser(req).id,
      })
      const followers = await User.findByPk(helper.getUser(req).id, {
        include: [{ model: User, as: 'Followers' }]
      })
      for(user of followers.Followers) {
        let roomName = helper.createPrivateRoom(Number(user.id), currentUserId)
        await Notice.create({
          roomName: roomName,
          isRead: false,
          TweetId: tweet.id,
          UserId: user.id,
        })
      }
      return callback({ status: 'success', message: '成功新增推文', tweet: tweet })
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '無法新增推文，請稍後再試' })
    }
  }
}

module.exports = tweetService