const helper = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship, Notice } = db

const noticeService = {
  getNotices: async (req, res, callback) => {
    try {
      console.log()
      Notice.findAll({
        where: {
          UserId: helper.getUser(req).id
        },
        include: [
          { model: Tweet, include: User }, 
          { model: Reply, include: [User, { model: Tweet, include: [User] }] }, 
          { model: Like, include: [User, {model: Tweet, include: [User] }] } 
        ],
        order: [['createdAt', 'DESC']],
      }).then(notices => {
        return callback({ status: 'success', message: '成功取得使用者通知', notices: notices })
      })
    } catch (error) {
      return callback({ status: 'error', message: '無法取得使用者通知，請稍後再試' })
    }
  },
  getUnreadNotices: async (req, res, callback
    ) => {
      try {
        const unreadNotices = await Notice.count({
          where: {
            UserId: helper.getUser(req).id,
            isRead: 0
          },
        })
        return callback({ status: 'success', message: '成功取得使用者通知', unreadNotices: unreadNotices })
      } catch (error) {
        return callback({ status: 'error', message: '無法取得使用者未讀通知，請稍後再試' })
      }
  },
  toggleNotices: async (req, res, callback) => {
    try {
      const notices = await Notice.findAll({
        where: { UserId: helper.getUser(req).id }
      })
      for( notice of notices) {
        notice.update({
          isRead: 1
        })
      }
      return callback({ status: 'success', message: '成功已讀通知'})
    } catch (error) {
      return callback({ status: 'error', message: '無法已讀通知，請稍後再試'})
    }
  }
}

module.exports = noticeService