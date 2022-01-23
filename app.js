const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// use body-parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// use session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
// put flash into res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

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

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// route app using ./routes
require('./routes')(app)

module.exports = app
