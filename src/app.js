const { Client, LocalAuth } = require('whatsapp-web.js');
const { ChatAIHandler } = require('./feature/chat_ai.js');
const { phoneNumberFormatter } = require('./helpers/formatNumber.js');
const qrcode = require('qrcode');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const client = new Client({
    authStrategy: new LocalAuth(),
})

client.on('message', async (message) => {
	if(message.body === 'Test') {
		message.reply('Haiii!\nKirim foto untuk dibuat sticker\nGunakan # untuk menanyakan sesuatu');
	}else if(message.body.startsWith('#')) {
		ChatAIHandler(message.body.substring(1)).then(result => message.reply(result))
	}else if(message.hasMedia) {
        const media = await message.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
})

client.initialize();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile('index.html', { 
        root: path.join(__dirname, '../public') 
    });
})

io.on('connection', function(socket) {
    socket.emit('message', 'Connecting...');

    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'QR Code Received, scan please !');
        })
    })

    client.on('ready', () => {
        socket.emit('message', 'Client is ready!');
    
        const number = phoneNumberFormatter('089630743492');
        const text = 'Bot Sudah siap!';
    
        client.sendMessage(number, text);
    })

    client.on('disconnected', (reason) => {
        socket.emit('message', 'Disconnected Whatsapp-bot', reason);
    })
})

server.listen(8000, function() {
    console.log('App Running on:' + 8000);
})