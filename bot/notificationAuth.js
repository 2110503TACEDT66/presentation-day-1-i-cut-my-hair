const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

const sendNotification_Register = (user) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    const message = `●══════⋆☆⋆══════●\n:tada: **New user registered** :tada: \n**Name**: ${user.name} \n**Role**: ${user.role}\n**Email**: ${user.email} \n●══════⋆☆⋆══════●`;
    channel.send(message);
};

const sendNotification_Login = (user) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    const message = `⚿ **Login:** ${user.email}`;
    channel.send(message);
};

const sendNotification_GetMe = (user) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    const message = `✔ **GetUser:** ${user.email} (${user.role})`;
    channel.send(message);
};

const sendNotification_Logout = () => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    const message = `Someone has logged out.`;
    channel.send(message);


};


module.exports = {
    sendNotification_Register,
    sendNotification_Login,
    sendNotification_GetMe,
    sendNotification_Logout
};
