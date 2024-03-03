const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});


const sendNotification = (message) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');
    channel.send(message);
};

module.exports = sendNotification;

