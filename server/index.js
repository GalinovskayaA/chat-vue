const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = 3030
const socketio = require('socket.io')(http, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
})
const chat = require('./chat')
const game = require('./game')

chat.initialise(socketio)
game.initialise(socketio)

socketio.on('connection', (socket) => {
  // new socket connected

  // listen for a 'message' event
  socket.on('message', (eventData) => {
    // attach the current time
    eventData.processed = Date.now()

    // send the message back to the client
    socket.emit('message', eventData)
  })

  chat.run(socket)
  game.run(socket)
  console.log('chat.run(socket)')
})

http.listen(port, () => {
  console.log('Server started on port', port)
})
