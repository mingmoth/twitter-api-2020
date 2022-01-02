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
      return res.json({
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
    if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.checkPassword) {
      return res.json({ status: 'error', messages: '請確認所有欄位已確實填寫' })
    }
    if (req.body.password !== req.body.checkPassword) {
      return res.json({ status: 'error', messages: '兩次密碼輸入不一致' })
    }
    User.findOne({
      where: { email: req.body.email }
    }).then(user => {
      if (user) {
        return res.json({ status: 'error', messages: '此電子郵件已重複使用' })
      }
    })
    User.findOne({
      where: { account: req.body.account }
    }).then(user => {
      if (user) {
        return res.json({ status: 'error', messages: '此帳號已重複使用' })
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          account: req.body.account,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          role: 'user',
        }).then(user => {
          return res.json({ status: 'success', messages: '成功註冊帳號' })
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

  // cancel like from tweet

  // follow one user

  // unfollow one user

  // get top follows users
}

module.exports = userController