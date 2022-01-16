const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helper = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userService = {
  signUp: async (req, res, callback) => {
    if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.checkPassword) {
      callback({ status: 'error', messages: '請確認所有欄位已確實填寫' })
    }
    if (req.body.password !== req.body.checkPassword) {
      callback({ status: 'error', messages: '兩次密碼輸入不一致' })
    }
    try {
      const checkAccount = await User.findOne({ where: { account: req.body.account } })
      const checkEmail = await User.findOne({ where: { email: req.body.email } })
      if (checkAccount) {
        return callback({ status: 'error', messages: `此帳號${checkAccount.account}已重複使用` })
      } 
      if (checkEmail) {
        return callback({ status: 'error', messages: `此電子郵件${checkEmail.email}已重複使用` })
      }
      await User.create({
        name: req.body.name,
        email: req.body.email,
        account: req.body.account,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        role: 'user',
      })
      return callback({ status: '200', messages: '成功註冊帳號' })
    } catch (error) {
      return callback({ status: '500', messages: '無法註冊帳號，請稍後再試' })
    }
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
      return callback({ status: 'error', message: '無法取得當前使用者資訊' })
    }
  },
  // get one user
  getUser: async (req, res, callback) => {
    try {
      await User.findByPk(req.params.id, {
        include: [Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }).then(user => {
        user = ({
          ...user.dataValues,
          password: '',
          Tweets: user.Tweets.length,
          isFollowed: req.user.Followings.map(f => f.id).includes(user.id),
        })
        return callback({ status: '200', user: user })
      })
    } catch (error) {
      return callback({ status: '500', message: '無法取使用者資訊' })
    }
  },
  // get one user's tweets
  getUserTweet: (req, res, callback) => {
    Tweet.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    }).then(tweets => {
      tweets = tweets.map(tweet => {
        return tweet = {
          ...tweet.dataValues,
          Replies: tweet.Replies.length,
          Likes: tweet.Likes.length,
          isLiked: tweet.Likes.map(d => d.UserId).includes(helper.getUser(req).id)
        }
      })
      return callback({ status: '200', tweets: tweets })
    }).catch(error => {
      return callback({ status: '500', message: '無法取得使用者推文資訊，請稍後再試' })
    })
  },
  // get one user's replies
  getUserReply: (req, res, callback) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like, {
        model: Reply,
        where: {
          UserId: req.params.id,
        },
        include: [User],
      }],
    }).then(tweets => {
      tweets = tweets.map(tweet => {
        return tweet = {
          ...tweet.dataValues,
          isLiked: tweet.Likes.map(d => d.UserId).includes(helper.getUser(req).id)
        }
      })
      return callback({ status: '200', tweets: tweets })
    }).catch(error => { return callback({ status: '500', message: '無法取得使用者回復資訊，請稍後再試' }) })
  },
  // get one user's liked tweets
  getUserLike: (req, res, callback) => {
    Like.findAll({
      where: { UserId: req.params.id },
      include: [{ model: Tweet, include: [User, Reply, Like] }]
    }).then(likes => {
      likes = likes.map(like => {
        return like = {
          ...like.Tweet.dataValues,
          Replies: like.Tweet.Replies.length,
          Likes: like.Tweet.Likes.length,
          isLiked: like.Tweet.Likes.map(like => like.UserId).includes(helper.getUser(req).id)
        }
      })
      return callback({ status: '200', likes: likes })
    }).catch(error => { return callback({ status: '500', message: '無法取得使用者按讚資訊，請稍後再試', error: error }) })
  },
  // get one user's followings
  getFollowing: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }]
    }).then(users => {
      users = users.Followings.map(user => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(f => f.id).includes(user.id),
      }))
      return callback({ status: '200', users: users })
    }).catch(error => {
      return callback({ status: '500', message: '無法取得此使用者追蹤對象' })
    })
  },
  // get one user's followers
  getFollower: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.Followers.map(user => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(f => f.id).includes(user.id),
      }))
      return callback({ users: users })
    }).catch(error => { return callback({ status: 'error', message: '無法取得追蹤此使用者對象' }) })
  },
  // edit self profile
  putUser: (req, res, callback) => {
    // console.log((req.params.id))
    // console.log(helper.getUser(req).id)
    // if (Number(req.params.id) !== Number(helper.getUser(req).id)) return callback({ status: 'error', message: '無法編輯非本人資訊' })
    if (!req.body.account || !req.body.name || !req.body.email || !req.body.password || !req.body.checkPassword) return callback({ status: 'error', message: '請確認所有欄位皆已填寫' })
    if (req.body.password !== req.body.checkPassword) return callback({ status: 'error', message: '兩次密碼輸入不正確' })
    User.findOne({
      where: { account: req.body.account }
    }).then(user => {
      if (Number(user.id) !== Number(helper.getUser(req).id)) {
        return callback({ status: 'error', message: '此帳號已重複使用' })
      } else {
        User.findOne({
          where: { email: req.body.email }
        }).then(user => {
          if (Number(user.id) !== Number(helper.getUser(req).id)) {
            return callback({ status: 'error', message: '此電子郵件已重複使用' })
          } else {
            return User.findByPk(helper.getUser(req).id).then(user => {
              user.update({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                return callback({ status: 'success', message: '成功更新使用者資訊' })
              }).catch(error => { return callback({ status: 'error', message: '無法更新使用者資訊，請稍後再試' }) })
            })
          }
        })
      }
    })
  },
  // update user avatar / cover
  updateUser: async (req, res, callback) => {
    if (Number(req.params.id) !== Number(helper.getUser(req).id)) return callback({ status: 'error', message: '無法編輯非本人帳號' })
    if (!req.body.name) return callback({ status: 'error', message: '請確認填寫帳戶名稱' })

    console.log(req.body.introduction)
    if (req.body.introduction ? req.body.introduction.length > 160 ? ture : false : false) return callback({ status: 'error', message: '自我介紹不得超過160字元' })
    try {
      const user = await User.findByPk(helper.getUser(req).id)
      const { name, introduction } = req.body
      const { files } = req
      if (!files) {
        await user.update({
          name, introduction
        })
        return callback({ status: 'success', message: '成功更新使用者資訊' })

      } else {
        imgur.setClientID(IMGUR_CLIENT_ID);
        const uploadImg = (file) => {
          return new Promise((resolve, reject) => {
            imgur.upload(file, (err, res) => {
              resolve(res.data.link);
            });
          });
        };

        const newAvatar = files.avatar
          ? await uploadImg(files.avatar[0].path)
          : user.avatar;

        const newCover = files.cover
          ? await uploadImg(files.cover[0].path)
          : user.cover;

        await user.update({
          name,
          introduction,
          avatar: newAvatar,
          cover: newCover,
        });
        return callback({
          status: "success",
          message: "成功更新使用者資訊與圖片",
        });
      }
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '無法更新使用者資訊與圖片' })
    }
  },
  // like one tweet
  addLike: (req, res, callback) => {
    Like.findOne({ where: { TweetId: req.params.id, UserId: helper.getUser(req).id } }).then(like => {
      if (like) {
        return callback({ status: 'error', message: '此篇推文已按讚' })
      } else {
        Like.create({
          TweetId: req.params.id,
          UserId: helper.getUser(req).id
        }).then(like => {
          return callback({ status: 'success', message: '成功對推文按讚', like: like })
        })
      }
    })
  },
  // cancel like from tweet
  removeLike: (req, res, callback) => {
    Like.findOne({ where: { TweetId: req.params.id, UserId: helper.getUser(req).id } }).then(like => {
      if (!like) {
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
    if (Number(req.body.UserId) === Number(helper.getUser(req).id)) {
      return callback({ status: 'error', message: '無法追蹤自己(當前使用者)' })
    }
    if (!req.body.UserId) return callback({ status: 'error', message: '請選定追蹤對象' })
    Followship.findOne({
      where: { followingId: req.body.UserId, followerId: helper.getUser(req).id }
    }).then(follow => {
      if (follow) {
        return callback({ status: 'error', message: '已追蹤此使用者' })
      } else {
        Followship.create({
          followingId: req.body.UserId,
          followerId: helper.getUser(req).id
        }).then(follow => {
          return callback({ status: 'success', message: '成功追蹤此使用者' })
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
      if (!follow) {
        return callback({ status: 'error', message: '尚未追蹤此使用者' })
      } else {
        follow.destroy().then(follow => {
          return callback({ status: 'success', message: '成功取消追蹤此使用者' })
        })
      }
    })
  },
  // get top follows users
  getTopUser: (req, res, callback) => {
    User.findAll({
      attributes: ['id', 'name', 'account', 'avatar',
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE followingId = User.id)'),
          'totalFollowers'],
      ],
      include: { model: User, as: 'Followers', attributes: [] },
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(f => f.id).includes(user.id)
      }))
      return callback({ users: users.filter(user => user.id !== req.user.id) })
    }).catch(error => { return callback({ status: 'error', message: '無法取得熱門追蹤者' }) })
  },
}

module.exports = userService