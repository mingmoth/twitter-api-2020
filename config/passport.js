const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

require('dotenv').config()

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, callback) => {
    User.findOne({ where: { account: username } }).then(user => {
      if(!user) {
        return callback(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return callback(null, false, req.flash('error_messages', '密碼輸入錯誤'))
      }
      return callback(null, user)
    })
  }
))

passport.serializeUser((user, callback) => {
  callback(null, user.id)
})
passport.deserializeUser((id, callback) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    user = user.toJSON() 
    return callback(null, user)
  })
})

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, 
    {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
      ]
    }
  ).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)


module.exports = passport