const { socketAuth } = require('../middleware/auth')

module.exports = (Server, httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true
  })
  const userList = []

  io.use(socketAuth).on('connection', (socket) => {
    console.log(socket.user)
  })
}