const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminService = require('../../services/adminService')

const adminController = {}

module.exports = adminController