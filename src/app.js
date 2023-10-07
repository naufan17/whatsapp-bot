require('dotenv').config()

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const client = require('./services/whatsappClient.js');
const socketHandler = require('./sockets/socketHandler.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile('index.html', { 
        root: path.join(__dirname, '../public') 
    });
})

socketHandler(io, client);

server.listen(port, function() {
    console.log('App Running on port ' + port);
})