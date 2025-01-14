const db = require('../../models')

const messageService = require('../../services/messageService')

const messageController = {
  postMessage: (req, res) => {
    messageService.postMessage(req, res, (data) => {
      return res.json(data)
    })
  },
  getPublicMessage: (req, res) => {
    messageService.getPublicMessage(req, res, (data) => {
      return res.json(data)
    })
  },
  getPrivateMessage: (req, res) => {
    messageService.getPrivateMessage(req, res, (data) => {
      return res.json(data)
    })
  },
  getUnreadMessage: (req, res) => {
    messageService.getUnreadMessage(req, res, (data) => {
      return res.json(data)
    })
  },
  toggelUnreadMessage: (req, res) => {
    messageService.toggelUnreadMessage(req, res, (data) => {
      return res.json(data)
    })
  },
  getMessagedUsers: (req, res) => {
    messageService.getMessagedUsers(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = messageController