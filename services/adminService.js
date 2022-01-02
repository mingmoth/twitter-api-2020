const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminService = {
  // get tweets by page
  getTweets: (req, res, callback) => {
    Tweet.findAndCountAll({})
  },
  // delete one tweet

  // get users
  getUser: (req, res, callback) => {
    User.findAll()
  }
}

module.exports = adminService