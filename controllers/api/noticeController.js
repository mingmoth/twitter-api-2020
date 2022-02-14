const db = require('../../models')

const noticeService = require('../../services/noticeService')

const noticeController = {
  getNotices: (req, res) => {
    noticeService.getNotices(req, res, (data) => {
      return res.json(data)
    })
  },
  getUnreadNotices: (req, res) => {
    noticeService.getUnreadNotices(req, res, (data) => {
      return res.json(data)
    })
  },
  toggleNotices: (req, res) => {
    noticeService.toggleNotices(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = noticeController