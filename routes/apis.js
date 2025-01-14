const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const multer = require("multer");
const upload = multer({ dest: "temp/" });

const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const adminController = require('../controllers/api/adminController')
const messageController = require('../controllers/api/messageController')
const noticeController = require('../controllers/api/noticeController')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === "admin") { return next() }
    return res.json({ status: 'error', message: '無存取權限' })
  } else {
    return res.json({ status: 'error', message: '無存取權限' })
  }
}

router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)

// user
router.get('/currentUser', authenticated, userController.getCurrentUser)

router.get('/users/top', authenticated, userController.getTopUser)

router.get('/users/:id', authenticated, userController.getUser)

router.get('/users/:id/tweets', authenticated, userController.getUserTweet)

router.get('/users/:id/replied_tweets', authenticated, userController.getUserReply)

router.get('/users/:id/likes', authenticated, userController.getUserLike)

router.get('/users/:id/followings', authenticated, userController.getFollowing)

router.get('/users/:id/followers', authenticated, userController.getFollower)

router.put('/users/:id', authenticated, userController.putUser)

router.put('/users/:id/profile', authenticated, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]), userController.updateUser)

// tweet
router.get('/tweets', authenticated, tweetController.getTweets)

router.post('/tweets', authenticated, tweetController.createTweet)

router.get('/tweets/:id', authenticated, tweetController.getTweet)

// notice
router.get('/notices', authenticated, noticeController.getNotices)

router.get('/notices/unread', authenticated, noticeController.getUnreadNotices)

router.put('/notices/unread', authenticated, noticeController.toggleNotices)

// message
router.post('/messages', authenticated, messageController.postMessage)

router.get('/messages/public', authenticated, messageController.getPublicMessage)

router.get('/messages/message', authenticated, messageController.getMessagedUsers)

router.get('/messages/unread', authenticated, messageController.getUnreadMessage)

router.put('/messages/unread/:roomName', authenticated, messageController.toggelUnreadMessage)

router.get('/messages/:roomName', authenticated, messageController.getPrivateMessage)

// reply
router.post('/tweets/:tweet_id/replies', authenticated, replyController.createReply)

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)

// like
router.post('/tweets/:id/like', authenticated, userController.addLike)

router.post('/tweets/:id/unlike', authenticated, userController.removeLike)

// followship
router.post('/followships', authenticated, userController.addFollow)

router.delete('/followships/:followingId', authenticated, userController.removeFollow)

// admin
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)


module.exports = router