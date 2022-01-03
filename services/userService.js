const bcrypt = require('bcryptjs')
const helper = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userService = {
  signUp: (req, res, callback) => {
    if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.checkPassword) {
      callback({ status: 'error', messages: '請確認所有欄位已確實填寫'})
    }
    if(req.body.password !== req.body.checkPassword) {
      callback({ status: 'error', messages: '兩次密碼輸入不一致' })
    }
    return User.findAll({
      where: {email: req.body.email}
    }).then(user => {
      if(user) {
        callback({ status: 'error', messages: '此電子郵件已重複使用' })
      }
    }).then(User.findAll({
      where: { account: req.body.account}
    })).then(user => {
      if(user) {
        callback({ status: 'error', messages: '此帳號已重複使用' })
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          acoount: req.body.account,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          role: 'user',
        }).then(user => {
          callback({ status: 'success', messages: '成功註冊帳號' })
        })
      }
    })
  },
  // get currentUser
  getCurrentUser: async (req, res, callback) => {
    try {
      await User.findByPk(helper.getUser(req).id 
      ).then(user => {
        user = ({
          ...user.dataValues,
          password: ''
        })
        return callback({ user: user })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得當前使用者資訊'})
    }
  },
  // get one user
  getUser: async (req, res, callback) => {
    try {
      await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }).then(user => {
        user = ({
          ...user.dataValues,
          password: ''
        })
        return callback({ user: user })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取使用者資訊' })
    }
  },
  // get one user's tweets
  getUserTweet: (req, res, callback) => {
    Tweet.findAll({
      where: { UserId: req.params.id},
      include: [User, Reply, Like]
    }).then(tweets => {
      tweets = tweets.map(tweet => {
        return tweet = {
          ...tweet.dataValues,
          Replies: tweet.Replies.length,
          Likes: tweet.Likes.length
        }
      })
      return callback({ tweets: tweets })
    }).catch(error => {
      return callback({ status: 'error', message: '無法取得使用者推文資訊，請稍後再試' })
    })
  },
  // get one user's replies
  getUserReply: (req, res, callback) => {
    Tweet.findAll({
      include: [{ model: Reply, where: { UserId: req.params.id } }, User]
    }).then(tweets => {
      return callback({ tweets: tweets })
    }).catch(error => { return callback({ status: 'error', message: '無法取得使用者回復資訊，請稍後再試' }) })
  },
  // get one user's liked tweets
  getUserLike: (req, res, callback) => {
    Like.findAll({
      where: { UserId: req.params.id },
      include: [{ model: Tweet, include: [User]}]
    }).then(likes => {
      likes = likes.map(like => {
        return like = {
          ...like.Tweet.dataValues,
        }
      })
      return callback({ likes: likes })
    }).catch(error => { return callback({ status: 'error', message: '無法取得使用者按讚資訊，請稍後再試' }) })
  },
  // get one user's followings
  
  // get one user's followers

  // like one tweet
  addLike: (req, res, callback) => {
    Like.findOne({ where: { TweetId: req.params.id, UserId: helper.getUser(req).id } }).then(like => {
      if(like) {
        return callback({ status: 'error', message: '此篇推文已按讚' })
      } else {
        Like.create({
          TweetId: req.params.id,
          UserId: helper.getUser(req).id
        }).then(like => {
          return callback({ status: 'success', message: '成功對推文按讚'})
        })
      }
    })
  },
  // cancel like from tweet
  removeLike: (req, res, callback) => {
    Like.findOne({ where: { TweetId: req.params.id, UserId: helper.getUser(req).id } }).then(like => {
      if(!like) {
        return callback({ status: 'error', message: '未對此篇推文按讚，無法取消讚' })
      } else {
        like.destroy().then(like => {
          return callback({ status: 'success', message: '成功對推文取消讚' })
        })
      }
    })
  },
  // follow one user
  addFollow: (req, res, callback) => {
    if(Number(req.body.UserId) === Number(helper.getUser(req).id)) {
      return callback({ status: 'error', message: '無法追蹤自己(當前使用者)' })
    }
    Followship.findOne({
      where: { followingId: req.body.UserId, followerId: helper.getUser(req).id }
    }).then(follow => {
      if(follow) {
        return callback({ status: 'error', message: '已追蹤此使用者' })
      } else {
        Followship.create({
          followingId: req.body.UserId,
          followerId: helper.getUser(req).id
        }).then(follow => {
          return callback({ status: 'success', message: '成功追蹤此使用者'})
        })
      }
    })
  },
  // unfollow one user
  removeFollow: (req, res, callback) => {
    let followingId = req.params.followingId
    let followerId = helper.getUser(req).id
    if (Number(followerId) === Number(followingId)) return callback({ status: 'error', message: '無法取消追蹤自己(當前使用者)' })
    Followship.findOne({
      where: { followingId: followingId, followerId: followerId }
    }).then(follow => {
      if(!follow) {
        return callback({ status: 'error', message: '尚未追蹤此使用者'})
      } else {
        follow.destroy().then(follow => {
          return callback({ status: 'success', message: '成功取消追蹤此使用者'})
        })
      }
    })
  }
  // get top follows users
}

module.exports = userService