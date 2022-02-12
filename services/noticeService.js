const helper = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship, Notice } = db

const noticeService = {
  getNotices: async (req, res, callback) => {
    try {
      console.log()
      Notice.findAll({
        where: {
          UserId: helper.getUser(req).id,
          isRead: 0
        },
        include: [{ model: Tweet, include: User }, Reply, Like ],
        order: [['createdAt', 'DESC']],
      }).then(notices => {
        return callback({ status: 'success', message: '成功取得使用者通知', notices: notices })
      })

    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '無法取得使用者通知，請稍後再試' })
    }
  }
}

module.exports = noticeService