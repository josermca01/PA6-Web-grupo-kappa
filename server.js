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

//Conecxões do servidor
const connections =[null,null]
io.on('connection',socket=>{
    let playerIndex = -1
    for(const i in connections){
        if(connections[i]===null){
            playerIndex=i
            break
        }

    }

    //Passa para o app qual o numero do jogador que conectou
    socket.emit('player-number',playerIndex)
    //Indica qual jogador conectou no terminal
    console.log(`Player ${playerIndex} has connected`)

    //Para impedir de ter mais de 2 jogadores conectados
    if(playerIndex===-1)
    return
    connections[playerIndex]=false
    //Passa para o app qual o jogador conectou
    socket.broadcast.emit('player-connection',playerIndex)

    //Abre vaga de quem desconectou do jogo
    socket.on('disconnect',()=>{
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex]=null
        socket.broadcast.emit('player-connection',playerIndex)
    })

    //Verifica se o jogador está pronto e informa para todos
    socket.on('player-ready',()=>{
        socket.broadcast.emit('enemy-ready',playerIndex)
        connections[playerIndex]=true
    })

    //Verifica se o jogador está pronto e informa para todos
    socket.on('check-players',()=>{
        const players =[]
        for(const i in connections){
            connections[i] === null ? players.push({connected: false,ready:false}):
            players.push({connected:true,ready:connections[i]})
        }
        socket.emit('check-players',players)
    })

    //Verifica onde o jogador atirou 
    socket.on('fire',id =>{
        console.log(`Ataque do player ${playerIndex} na posiçao`,id)
        socket.broadcast.emit('fire',id)
    })

    //Verifica qual a posição o jogador recebeu o ataque
    socket.on('fire-reply',square=>{
        console.log(square)
        socket.broadcast.emit('fire-reply',square)
    })

    
})