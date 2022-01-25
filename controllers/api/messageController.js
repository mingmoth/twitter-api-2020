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
  }
}

module.exports = messageController