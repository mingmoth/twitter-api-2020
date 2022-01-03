const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if(req.user) {
    if(req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: '無存取權限'})
  } else {
    return res.json({ status: 'error', message: '無存取權限' })
  }
}

router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)

// user
router.get('/users/:id')

router.get('/users/:id/tweets')

router.get('/users/:id/replied_tweets')

router.get('/users/:id/likes')

router.get('/users/:id/followings')

router.get('/users/:id/followers')

router.put('/users/:id')

// tweet
router.get('/tweets', authenticated, tweetController.getTweets)

router.post('/tweets', authenticated, tweetController.createTweet)

router.get('/tweets/:id', authenticated, tweetController.getTweet)

// reply
router.post('/tweets/:tweet_id/replies', authenticated, replyController.createReply)

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)

// like
router.post('/tweets/:id/like')

router.post('/tweets/:id/unlike')

// followship
router.post('/followships')

router.delete('/followships/:followingId')

// admin
router.get('/admin/users')

router.get('/admin/tweets')

router.delete('/admin/tweets/:id')


module.exports = router