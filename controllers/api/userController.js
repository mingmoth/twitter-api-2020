const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

const userService = require('../../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController