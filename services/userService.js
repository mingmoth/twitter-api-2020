const bcrypt = require('bcryptjs')
const helper = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
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

  // get one user

  // get one user's tweets
  
  // get one user's replies

  // get one user's liked tweets

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
  }
  // follow one user

  // unfollow one user

  // get top follows users
}

module.exports = userService