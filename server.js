const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,"public")))

server.listen(PORT,()=> console.log(`Server rodando na porta localhost:${PORT}`))

const connections =[null,null]
io.on('connection',socket=>{
    let playerIndex = -1
    for(const i in connections){
        if(connections[i]===null){
            playerIndex=i
            break
        }

    }

    socket.emit('player-number',playerIndex)

    if(playerIndex===-1)
    return
    connections[playerIndex]=false

    socket.broadcast.emit('player-connection',playerIndex)

    socket.on('disconnetc',()=>{
        connections[playerIndex]=null
        socket.broadcast.emit('player-connection',playerIndex)
    })

    socket.on('player-ready',()=>{
        socket.broadcast.emit('enemy-ready',playerIndex)
        connections[playerIndex]=true
    })

    socket.on('check-players',()=>{
        const players =[]
        for(const i in connections){
            connections[i]===null? players.push({connected: false,ready:false}):
            players.push({connected:true,ready:connections[i]})
        }
        socket.emit('check-players',players)
    })
})