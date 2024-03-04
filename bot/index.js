const {Client, Intents, GatewayIntentBits} = require('discord.js');

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

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;
