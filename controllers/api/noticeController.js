const db = require('../../models')

const noticeService = require('../../services/noticeService')

const noticeController = {
  getNotices: (req, res) => {
    noticeService.getNotices(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = noticeController