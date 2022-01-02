const db = require('../../models')
const Tweet = db.Tweet

const tweetService = require('../../services/tweetService')

const tweetController = {
  // get all tweets
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  // get one tweet

  // create new tweet
  createTweet: (req, res) => {
    tweetService.createTweet(req, res, (data) => {
      return res.json(data)
    })
  }
  // like one tweet

  // cancel like from tweet
}

module.exports = tweetController