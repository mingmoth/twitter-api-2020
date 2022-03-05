require('dotenv').config()

const passport = require('passport')
// const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
      ],
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    }
  ).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
//   profileFields: ['id', 'displayName', 'email', 'photos']
// }, (accessToken, refreshToken, profile, done) => {
//   console.log(profile)
//   User.findOne({ where: { email: profile._json.email }})
//     .then(user => {
//       if(user) return done(null, user)
//       const randomPassword = Math.random().toString(36).slice(-8)
//       bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(randomPassword, salt))
//         .then(hash => User.create({
//           name: profile.displayName,
//           account: profile.displayName.trim(),
//           email: profile._json.email,
//           password: hash,
//           role: 'user',
//           avatar: profile._json.picture.data.url
//         }))
//         .then(user => done(null, user))
//         .catch(err => done(err, false))
//     })
// }))


module.exports = passport