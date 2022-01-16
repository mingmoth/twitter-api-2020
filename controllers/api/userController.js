const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')

let userController = {
  signIn: (req, res) => {
    if(!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: '請輸入帳號及密碼登入'})
    }
    User.findOne({ where: { account: req.body.account} }).then(user => {
      // 若沒有account，回傳 HTTP 狀態碼 401，代表權限不足
      if(!user) return res.status(401).json({ status: 'error', message: '找不到此使用者帳號'})
      if(!bcrypt.compareSync(req.body.password, user.password)) return res.status(401).json({status: 'error', message: '密碼輸入不正確'})
      // 簽發token
      let payload = {id: user.id}
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: '登入成功',
        token: token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role
        }
      })
    })
  },
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  },
  // get currentUser
  getCurrentUser: (req, res) => {
    userService.getCurrentUser(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user's tweets
  getUserTweet: (req, res) => {
    userService.getUserTweet(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user's replies
  getUserReply: (req, res) => {
    userService.getUserReply(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user's liked tweets
  getUserLike: (req, res) => {
    userService.getUserLike(req, res, (data) => {
      return res.json(data)
    })
  },
  // edit self profile
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  },
  // update user avatar / cover
  updateUser: (req, res) => {
    userService.updateUser(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user's followings
  getFollowing:(req, res) => {
    userService.getFollowing(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one user's followers
  getFollower: (req, res) => {
    userService.getFollower(req, res, (data) => {
      return res.json(data)
    })
  },
  // like one tweet
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.json(data)
    })
  },
  // cancel like from tweet
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.json(data)
    })
  },
  // follow one user
  addFollow: (req, res) => {
    userService.addFollow(req, res, (data) => {
      return res.json(data)
    })
  },
  // unfollow one user
  removeFollow: (req, res) => {
    userService.removeFollow(req, res, (data) => {
      return res.json(data)
    })
  },
  // get top follows users
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = userController