const { User } = require('../models')
const jwt = require('jsonwebtoken')


module.exports = {
  socketAuth: (socket, next) => {
    const token = socket.handshake.auth.token
    const SECRET = process.env.JWT_SECRET
    jwt.verify(token, SECRET, async (err, decoded) => {
      const user = (await User.findByPk(decoded.id, {
        attributes: ['id', 'account', 'name', 'avatar'],
      })).toJSON()
      socket.user = user
      return next()
    })
  }
}