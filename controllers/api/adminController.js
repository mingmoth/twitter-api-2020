const db = require('../../models')
const User = db.User
const Tweet = db.Tweet

const adminService = require('../../services/adminService')

const adminController = {
  // get tweets by page

  // delete one tweet

  // get users
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController