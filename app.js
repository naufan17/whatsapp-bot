const { Client, LocalAuth } = require('whatsapp-web.js');
const { ChatAIHandler } = require('./feature/chat_ai.js');
const qrcode = require('qrcode');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

const client = new Client({
    authStrategy: new LocalAuth(),
});

// client.on('qr', (qr) => {
//     qrcode.generate(qr, {small: true});
// });

// client.on('ready', () => {
//     const number = '+6289630743492';
//     const text = 'Bot Sudah siap!';
//     const chatId = number.substring(1) + '@c.us';

//     client.sendMessage(chatId, text);
// });

client.on('disconnected', (reason) => {
    console.log('Disconnected Whatsapp-bot', reason);
});

client.on('message', async (message) => {
	if(message.body === 'Test') {
		message.reply('Haiii!\nKirim foto untuk dibuat sticker\nGunakan # untuk menanyakan sesuatu');
	}else if(message.body.startsWith('#')) {
		ChatAIHandler(message.body.substring(1)).then(result => message.reply(result))
	}else if(message.hasMedia) {
        const media = await message.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
});

client.initialize();

io.on('connection', function(socket) {
    socket.emit('message', 'Connecting...');

    client.on('qr', (qr) => {
        console.log('QR Received', qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'QR Code Received, scan please !');
        });
    });

    client.on('ready', () => {
        socket.emit('message', 'Client is ready!');
    
        const number = '+6289630743492';
        const text = 'Bot Sudah siap!';
        const chatId = number.substring(1) + '@c.us';
    
        client.sendMessage(chatId, text);
    });
});

app.post('/send-message', (req, res) => {
    const number = req.body.number;
    const message = req.body.message;

    client.sendMessage(number, message).then(response => {
        res.status(200).json({
            status: true,
            response: response
        });
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        });
    });
});

server.listen(8000, function() {
    console.log('App Running on *:' + 8000);
});