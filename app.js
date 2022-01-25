if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
// const session = require('express-session')
const passport = require('./config/passport')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000


const { createServer } = require('http')
const { Server } = require('socket.io')
const httpServer = createServer(app)

// use body-parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// use session and flash
// app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))



// setup passport
app.use(passport.initialize())
app.use(passport.session())

// use helpers.getUser(req) to replace req.user
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

// cors setting
app.use(cors())

// socket.io setting
require('./socket/socket')(Server, httpServer)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// route app using ./routes
require('./routes')(app)

module.exports = app
