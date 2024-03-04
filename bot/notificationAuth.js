const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

const sendNotification_Register = (user) => {
    const now = new Date(); 
    const dateTime = now.toLocaleString();
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  

    if (!channel_main_log) throw new Error('channel_main_log not found');

    let message = `**Registered ** Email: ${user.email} (${user.role}) `;
    message = `[${dateTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_Login = (user) => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  

    if (!channel_main_log) throw new Error('channel_main_log not found');

    let message = `**Login:** ${user.email}`;
    message = `[${dateTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_GetMe = (user) => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  

    if (!channel_main_log) throw new Error('channel_main_log not found');

    let message = `**GetUser:** ${user.email} (${user.role})`;
    message = `[${dateTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_Logout = (email) => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  

    if (!channel_main_log) throw new Error('Channel not found');

    let message = `**Logout** ${email} has been logged out.`;
    message = `[${dateTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);

};

module.exports = {
    sendNotification_Register,
    sendNotification_Login,
    sendNotification_GetMe,
    sendNotification_Logout
};
