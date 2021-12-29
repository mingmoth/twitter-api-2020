const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = requre('bcryptjs')
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
    User.findOne({ where: { account: username} }).then(user => {
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
  User.findByPk(id).then(user => {
    user = user.toJSON() 
    return callback(null, user)
  })
})


module.exports = passport