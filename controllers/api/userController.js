const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')

const userController = {
  signIn: (req, res) => {
    if(!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: '請輸入帳號及密碼登入'})
    }
    User.findOne({ where: { account: req.body.account} }).then(user => {
      // 若沒有account，回傳 HTTP 狀態碼 401，代表權限不足
      if(!user) return res.status(401).json({ status: 'error', message: '找不到此使用者帳號'})
      if(bcrypt.compareSync(req.body.password, user.password)) return res.status(401).json({status: 'error', message: '密碼輸入不正確'})
      // 簽發token
      let payload = {id: user.id}
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: '登入成功',
        token: token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
  },
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController