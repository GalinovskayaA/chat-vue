import io from 'socket.io-client'

let socketio = undefined
const localIP = 'localhost'
const networkIP = '192.168.100.69'
const port = 3030
const networkConnection = false

function initialiseSocket() {
  const url = networkConnection ?
    `http://${networkIP}:${port}` :
    `http://${localIP}:${port}`

  socketio = io(url)
}

export function addEventListener(event) {
  if (!socketio) initialiseSocket()

  socketio.on(event.type, event.callback)
}

export function sendEvent(event) {
  socketio.emit(event.type, event.data)
}
