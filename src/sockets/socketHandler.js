require('dotenv').config()

const qrcode = require('qrcode');
const { phoneNumberFormatter } = require('../helpers/formatNumber.js');

module.exports = function (io, client) {
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
}
