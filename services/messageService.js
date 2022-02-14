const helper = require('../_helpers')
const sequelaize = require("sequelize");
const { Op } = sequelaize
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

  getMessagedUsers: async (req, res, callback) => {
    const currentUserId = helper.getUser(req).id
    const latestMessages = []
    const latestUsers = []
    try {
      const messages = await Message.findAll({
        raw: true,
        nest: true,
        where: {
          roomName: {
            [Op.or]: [{ [Op.like]: `%-${currentUserId}` }, { [Op.like]: `${currentUserId}-%` }]
          }, 
        },
        attributes: ['roomName'],
        order: [['createdAt', 'DESC']],
        group: ['roomName']
      })
      for( message of messages) {
        try {
          const latest = await Message.findOne({
            where: message,
            order: [['createdAt', 'DESC']],
          })
          latestMessages.push(latest)
        } catch (error) {
          console.log(error)
        }
      }
      for( message of messages) {
        try {
          const userId = helper.getMessagedUser(message.roomName, currentUserId)
          const user = await User.findByPk(userId, {
            attributes: { exclude: ['password']}
          })
          latestUsers.push(user)
        } catch (error) {
          console.log(error)
        }
      }
      return callback({ status: 'success', message: '成功取得私訊紀錄', messages: latestMessages, users: latestUsers })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得私訊紀錄，請稍後再試'})
    }
  },
  getUnreadMessage: async (req, res, callback) => {
    try {
      const userId = helper.getUser(req).id
      const messages = await Message.findAll({
        where: {
          roomName: {
            [Op.or]: [{ [Op.like]: `${userId}-%`}, {[Op.like]: `%-${userId}`}]
          },
          isRead: 0
        }
      })
      return callback({ status: 'success', message: '成功取得未讀訊息', messages: messages})
    } catch (error) {
      return callback({ status: 'error', message: '無法取得未讀訊息，請稍後再試' })
    }
  },
  // socket getUnreadMessage
  getUnreadMessageS: async(currentUserId) => {
    try {
      const unreadMessage = await Message.findAll({
        where: {
          roomName: {
            [Op.or]: [{ [Op.like]: `%-${currentUserId}` }, { [Op.like]: `${currentUserId}-%` }]
          },
          isRead: 0,
          UserId: { [Op.not]: currentUserId }
        }
      })
      return unreadMessage
    } catch (error) {
      console.log(error)
    }
  },
  toggelUnreadMessage: async(req, res, callback) => {
    try {
      const roomName = req.params.roomName
      console.log('roomName: ', roomName)
      const messages = await Message.findAll({
        where: { roomName: req.params.roomName },
      })
      for(message of messages) {
        await message.update({
          isRead: 1
        })
      }
      return callback({ status: 'success', message: '成功已讀訊息' })
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '無法標記未讀訊息，請稍後再試' })
    }
  },
  getPrivateMessage: async (req, res, callback) => {
    try {
      console.log(req.params.roomName)
      await Message.findAll({
        where: { roomName: req.params.roomName },
        order: [['createdAt', 'ASC']],
        include: [ User ],
      }).then(messages => {
        return callback({ status: 'success', message: '成功取得訊息', messages: messages })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得私人聊天訊息，請稍後再試' })
    }
  },
}

module.exports = messageService