const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Pega conexão com o web client
const connections = [null, null]

io.on('connection', socket => {
  // console.log('New WS Connection')

  // Encontra um numero para o player
  let playerIndex = -1;
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i
      break
    }
  }

  // Informa para o servidor qual o numero do jogador
  socket.emit('player-number', playerIndex)

  console.log(`Player ${playerIndex} has connected`)

  // Ignora player 3
  if (playerIndex === -1) return

  connections[playerIndex] = false

  // Informa a todos qual o numero do jogador que conectou
  socket.broadcast.emit('player-connection', playerIndex)

  // lida com Diconnect
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    //Informa a todos qual o numero do jogador que desconectou
    socket.broadcast.emit('player-connection', playerIndex)
  })

  // No preparo
  socket.on('player-ready', () => {
    socket.broadcast.emit('enemy-ready', playerIndex)
    connections[playerIndex] = true
  })

  // Checa conexão dos players 
  socket.on('check-players', () => {
    const players = []
    for (const i in connections) {
      connections[i] === null ? players.push({connected: false, ready: false}) : players.push({connected: true, ready: connections[i]})
    }
    socket.emit('check-players', players)
  })

  // Tiro recebido
  socket.on('fire', id => {
    console.log(`Shot fired from ${playerIndex}`, id)

    // Passa o turno para o outro player
    socket.broadcast.emit('fire', id)
  })

  // Resposta do player que recebeu o ultimo tiro
  socket.on('fire-reply', square => {
    console.log(square)

    // Volta o turno para o outro player
    socket.broadcast.emit('fire-reply', square)
  })

  // Timeout connection
  setTimeout(() => {
    connections[playerIndex] = null
    socket.emit('timeout')
    socket.disconnect()
  }, 600000) // 10 minutos por player e por turno
})