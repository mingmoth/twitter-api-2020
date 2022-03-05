const { socketAuth } = require('../middleware/auth')
const messageService = require('../services/messageService')
const helper = require('../_helpers')

module.exports = (Server, httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true
  })
  let userList = []

  io.use(socketAuth).on('connection', (socket) => {
    console.log('user connect')
    // 取得當前使用者資訊
    const currentUser = socket.user
    
    // 取得上線者資料
    const checkUser = userList.find(user => user.id === currentUser.id)
    if (!checkUser) {
      userList.push(socket.user)
    }

    // 未讀私人訊息
    socket.on('getUnreadMessage', async (currentUserId) => {
      const unreadMessage = await messageService.getUnreadMessageS(currentUserId)
      socket.emit('unreadMessage', unreadMessage)
    })

    // 未讀通知
    socket.on('sendNotice', () => {
      socket.broadcast.emit('getUnreadNotice')
    })

    // 加入特定頻道(public or private)
    socket.on('join', async (data) => {
      if (data.roomName === 'public') {
        socket.join('public')
        io.emit('join', {
          roomName: 'public',
          message: `${currentUser.name} 進入聊天室`,
          type: 'announce'
        })
        io.emit('publicUser', userList)
      }
      else {
        socket.leaveAll()
        socket.join(data.roomName)
        io.to(data.roomName).emit('join',{
          ...data,
          message: `join ${data.roomName} Room`,
          type: 'announce'
        })
      }
    })

    // 離開特定頻道(public or private)
    socket.on('leave', (data) => {
      if (data.roomName === 'public') {
        socket.leave('public')
        io.emit('leave', {
          roomName: 'public',
          message: `${currentUser.name} 離開聊天室`,
          type: 'announce'
        })
        io.emit('publicUser', userList)
        return userList
      }
    })

    // 傳送訊息
    socket.on('sendMessage', async (data) => {
      // 輸入空白訊息，不動作
      if (data.message.trim() === '') {
        return
      }
      if(data.roomName === 'public') {
        io.to('public').emit('newMessage', data)
      } else {
        console.log(data.roomName)
        io.to(data.roomName).emit('newMessage', data)
        socket.broadcast.emit('privateMessage')
      }
      
    })

    // 使用者離線
    socket.on('disconnect', async () => {
      console.log('The user disconnected')
      const index = userList.findIndex(user => user.id === currentUser.id)
      userList.splice(index, 1)
      io.emit('offlineUser', `${currentUser.name}已經離開了`)
      io.emit('publicUser', userList)
    })
  })
}