const db = require('../../models')
const User = db.User
const Tweet = db.Tweet

const adminService = require('../../services/adminService')

const adminController = {
  // get tweets by page
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  // delete one tweet
  deleteTweet: (req, res) => {
    adminService.deleteTweet(req, res, (data) => {
      return res.json(data)
    })
  },
  // get users
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController