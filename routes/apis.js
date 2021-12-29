const express = require('express')
const router = express.Router()

const userController = require('../controllers/api/userController')

router.post('/signin', userController.signIn)

module.exports = router