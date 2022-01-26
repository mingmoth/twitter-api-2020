const { socketAuth } = require('../middleware/auth')

module.exports = (Server, httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    allowEIO3: true
  })
  let userList = []

  io.on('connection', (socket) => {
    console.log('connecttttttttttttttttttttttt')
    // 取得當前使用者資訊
    // const currentUser = socket.user
    
    // 取得上線者資料
    // const checkUser = userList.find(user => user.id === currentUser.id)
    // if (!checkUser) {
    //   userList.push(socket.user)
    // }
    // console.log(userList)

    // 未讀私人訊息
    // socket.on('messageNotReadInit', async () => {
    //   const notRead = await getNotRead(currentUser.id)
    //   console.log('init', notRead)
    //   socket.emit('messageNotRead', notRead)
    // })

    // 加入特定頻道(public or private)
    socket.on('joinRoom', async (data) => {
      if (data.roomName === 'public') {
        if (!userList.map(userlist => userlist.id).includes(data.user.id)) {
          userList = userList.concat(data.user)
        }
        socket.join('public')
        console.log(data.user.id)
        io.emit('join', {
          ...data,
          message: `${data.user.name} 進入聊天室`,
          type: 'announce'
        })
        io.emit('onlineUser', userList)
      }
      // else {
      //   socket.leaveAll()
      //   const userId = Number(data.id) // 其他使用者id
      //   const roomName = createRoomName(userId, currentUser.id)
      //   socket.join(roomName)
      //   console.log(`${currentUser.name} has join ${roomName} Room`)

      //   // 移除特定頻道的未讀
      //   await changeToRead(roomName, currentUser.id)
      //   const notRead = await getNotRead(currentUser.id)
      //   console.log('join', notRead)
      //   socket.emit('messageNotRead', notRead)
      // }
    })

    // 離開特定頻道(public or private)
    socket.on('leaveRoom', (data) => {
      if (data.roomName === 'public') {
        console.log(data.user.id)
        userList = userList.filter(userlist => userlist.id !== data.user.id)
        socket.leave('public')
        io.emit('leave', {
          ...data,
          message: `${data.user.name} 離開聊天室`,
          type: 'announce'
        })
        io.emit('onlineUser', userList)
        return userList
      }
      // else {
      //   const userId = Number(data.id)
      //   const roomName = createRoomName(userId, currentUser.id)
      //   console.log(`${currentUser.name} has left ${roomName} Room`)
      //   socket.join(roomName)
      // }
    })

    // 傳送訊息
    socket.on('sendMessage', async (data) => {
      console.log(data.message)
      // 輸入空白訊息，不動作
      if (data.message.trim() === '') {
        return
      }
      io.emit('newMessage', {
        ...data,
        type: 'message'
      })

      // 根據公開頻道或是私人頻道做相應處理
      // if (data.roomName === 'public') {
      //   const message = await postMessage(data, currentUser.id)
      //   message.avatar = currentUser.avatar
      //   io.to(data.roomName).emit('message', data.message)
      // } 
      // else {
      //   const userId = Number(data.id) // 其他使用者id
      //   if (userId === -1) {
      //     return
      //   }
      //   const roomName = createRoomName(userId, currentUser.id)
      //   data.roomName = roomName
      //   const message = await postMessage(data, currentUser.id)
      //   message.avatar = currentUser.avatar
      //   io.to(message.roomName).emit('message', message)
      //   socket.broadcast.emit('privateMessage')
      // }
    })

    // 使用者離線
    socket.on('disconnect', async () => {
      console.log('The user disconnected')
      const index = userList.findIndex(user => user.id === currentUser.id)
      userList.splice(index, 1)
      io.emit('loginStatus', `${currentUser.name}已經離開了`)
      io.emit('loginUser', userList)
    })
  })
}