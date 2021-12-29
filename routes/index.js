let apis = require('./apis')

module.exports = (app) => {
  app.use('/apis', apis)
}