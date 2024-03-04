const {Client, Intents, GatewayIntentBits} = require('discord.js');
const decryptedText = require('./cryptography');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages , 
        GatewayIntentBits.MessageContent
    ],
});

//Load env vars
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

client.on('ready', () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
});

client.login(decryptedText.decryptedText);

module.exports = client;
