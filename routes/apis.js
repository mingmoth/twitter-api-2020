const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const adminController = require('../controllers/api/adminController')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if(req.user) {
    if (req.user.role === "admin") { return next() }
    return res.json({ status: 'error', message: '無存取權限'})
  } else {
    return res.json({ status: 'error', message: '無存取權限' })
  }
}

router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)

// user
router.get('/currentUser', authenticated, userController.getCurrentUser)

router.get('/users/:id', authenticated, userController.getUser)

router.get('/users/:id/tweets', authenticated, userController.getUserTweet)

router.get('/users/:id/replied_tweets', authenticated, userController.getUserReply)

router.get('/users/:id/likes', authenticated, userController.getUserLike)

router.get('/users/:id/followings', authenticated, userController.getFollowing)

router.get('/users/:id/followers', authenticated, userController.getFollower)

router.put('/users/:id', authenticated, userController.putUser)

// tweet
router.get('/tweets', authenticated, tweetController.getTweets)

router.post('/tweets', authenticated, tweetController.createTweet)

router.get('/tweets/:id', authenticated, tweetController.getTweet)

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

router.get('/admin/tweets')

router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)


module.exports = router