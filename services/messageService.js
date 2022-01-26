const helper = require('../_helpers')
const db = require('../models')
const { Message, User } = db

const messageService = {
  postMessage: async(req, res, callback) => {
    const { message, roomName, type } = req.body
    if(!message.trim()) return
    try {
      await Message.create({
        type: type,
        message: message,
        UserId: helper.getUser(req).id,
        roomName: roomName,
      }).then(message => {
        return callback({ status: 'success', message: '成功傳送訊息', messages: message })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法傳送訊息，請稍後再試' })
    }
  },

  getPublicMessage: async(req, res, callback) => {
    try {
      await Message.findAll({
        where: { roomName: 'public' },
        order: [['createdAt', 'ASC']],
        include: [User],
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
        where: { roomName: ['req.body.roomName'] },
        order: [['createdAt', 'ASC']],
        include: [ User ],
      }).then(messages => {
        return callback({ status: 'success', message: '成功傳送訊息', messages: messages })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得私人聊天訊息，請稍後再試' })
    }
  },
}

module.exports = messageService