const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userService = {
  signUp: (req, res, callback) => {
    if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.checkPassword) {
      callback({ status: 'error', messages: '請確認所有欄位已確實填寫'})
    }
    if(req.body.password !== req.body.checkPassword) {
      callback({ status: 'error', messages: '兩次密碼輸入不一致' })
    }
    return User.findAll({
      where: {email: req.body.email}
    }).then(user => {
      if(user) {
        callback({ status: 'error', messages: '此電子郵件已重複使用' })
      }
    }).then(User.findAll({
      where: { account: req.body.account}
    })).then(user => {
      if(user) {
        callback({ status: 'error', messages: '此帳號已重複使用' })
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          acoount: req.body.account,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          role: 'user',
        }).then(user => {
          callback({ status: 'success', messages: '成功註冊帳號' })
        })
      }
    })
  }
}

module.exports = userService