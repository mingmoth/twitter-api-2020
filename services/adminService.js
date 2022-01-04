const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

const pageLimit = 10

const adminService = {
  // get tweets by page
  getTweets: (req, res, callback) => {
    let offset = 0
    if(req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    Tweet.findAndCountAll({
      order: [['createdAt', 'DESC']],
      include: [User],
      offset: offset,
      limit: pageLimit
    }).then(tweets => {
      return callback({ tweets: tweets.rows })
    }).catch(error => { return callback({ status: 'error', message: '無法取得推文資訊' }) })
  },
  // delete one tweet
  deleteTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.id).then(tweet => {
      tweet.destroy()
        .then(tweet => { return callback({ statuts: 'success', message: '成功刪除推文' }) })
        .catch(error => { return callback({ status: 'error', message: '無法刪除推文，請稍後再試' }) })
    })
  },
  // get users
  getUsers: (req, res, callback) => {
    User.findAll({
      include: [
        { model: Tweet, include: [Like] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => {
        let LikeCount = 0
        return user = {
          ...user.dataValues,
          Tweets: user.Tweets.length,
          Likes: user.Tweets.map(t => {
            return LikeCount += t.Likes.length
          }).reverse()[0],
          Followings: user.Followings.length,
          Followers: user.Followers.length
        }
      })
      return callback({ users: users })
    }).catch(error => { return callback({ status: 'error', message: '無法取得使用者資訊，請稍後再試' }) })
  }
}

module.exports = adminService