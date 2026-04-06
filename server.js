const http = require('http')

const express = require('express');
const server = express();
const socketio = require('socket.io');
const socketServer = http.createServer(server);
const io = socketio(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
server.get('/', (req, res) => {
    return res.json('connect to socket!!!')
})

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
});


io.on("connection", function (socket) {
    console.log('connected', socket.id)
    socket.on('send-location', (data) => {
        io.emit('recieve-location', { id: socket.id, ...data })
    })
    socket.on('disconnect', function (data) {
        io.emit('user-disconnect', socket.id)
    })
})


socketServer.listen(8080, () => {
    console.log('Listening on port 8080');
});
