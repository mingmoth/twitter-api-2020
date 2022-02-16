if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const { createServer } = require('http')
const { Server } = require('socket.io')
const httpServer = createServer(app)

// use body-parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// cors setting
app.use(cors())

// socket.io setting
require('./socket/socket')(Server, httpServer)

// route app using ./routes
require('./routes')(app)

httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
