const helper = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetService = {
  // get all tweets
  getTweets: (req, res, callback) => {
    Tweet.findAll({
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
    Tweet.findOne({ where: {id: req.params.id} })
  },
  // create new tweet
  createTweet: async (req, res, callback) => {
    if (!req.body.description) return callback({status: 'error', message: '請輸入推文內容'})
    if(req.body.description.length > 140) return callback({status: 'error', message: '推文字數需小於140單位'})
    try {
      await Tweet.create({
        description: req.body.description,
        UserId: helper.getUser(req).id,
      }).then(tweet => {
        return callback({status: 'success', message: '成功新增推文'})
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法新增推文，請稍後再試' })
    }
  }
}

module.exports = tweetService