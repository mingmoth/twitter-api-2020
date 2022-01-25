const helper = require('../_helpers')
const db = require('../models')
const { Message, User } = db

const messageService = {
  postMessage: async(req, res, callback) => {
    const { message, roomName } = req.body
    if(!message.trim()) return
    try {
      await Message.create({
        message: message,
        UserId: helper.getUser(req).id,
        roomName: roomName
      }).then(message => {
        return callback({ status: 'success', message: '成功傳送訊息', message: message })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法傳送訊息，請稍後再試' })
    }
  },

  getPublicMessage: async(req, res, callback) => {
    try {
      await Message.findAll({
        where: { roomName: [helper.getUser(req).id] }
      }).then(messages => {
        return callback({ status: 'success', message: '成功傳送訊息', messages: messages })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得公開聊天訊息，請稍後再試' })
    }
  },

  getPrivateMessage: async (req, res, callback) => {
    try {
      await Message.findAll({
        where: { roomName: ['req.body.roomName'] }
      }).then(messages => {
        return callback({ status: 'success', message: '成功傳送訊息', messages: messages })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得私人聊天訊息，請稍後再試' })
    }
  },
}

module.exports = messageService