require('dotenv').config()

const { Client, LocalAuth } = require('whatsapp-web.js');
const { ChatAIHandler } = require('../feature/chatAI');

const client = new Client({
    authStrategy: new LocalAuth(),
})

client.on('message', async (message) => {
	if(message.body === 'Test') {
		message.reply('Haiii!\nKirim foto untuk dibuat sticker');
	}else if(message.body.startsWith('#')) {
		ChatAIHandler(message.body.substring(1)).then(result => message.reply(result))
	}else if(message.hasMedia) {
        const media = await message.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
})

client.initialize();

module.exports = client;