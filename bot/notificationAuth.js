const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

const now = new Date();
const dateTime = now.toLocaleString();
const line = ``;

const sendNotification_Register = (user) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    let message = `**New user registered** \n**Email**: ${user.email} (${user.role}) `;
    message = `[${dateTime}] ${message}  ${line}`
    channel.send(message);
};

const sendNotification_Login = (user) => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    let message = `**Login:** ${user.email}`;
    message = `[${dateTime}] ${message}  ${line}`
    channel.send(message);
};

const sendNotification_GetMe = (user) => {
    let channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    let message = `**GetUser:** ${user.email} (${user.role})`;
    message = `[${dateTime}] ${message}  ${line}`
    channel.send(message);
};

const sendNotification_Logout = () => {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);  
    if (!channel) throw new Error('Channel not found');

    let message = `Someone has been logged out.`;
    message = `[${dateTime}] ${message}  ${line}`
    channel.send(message);
};

module.exports = {
    sendNotification_Register,
    sendNotification_Login,
    sendNotification_GetMe,
    sendNotification_Logout
};
