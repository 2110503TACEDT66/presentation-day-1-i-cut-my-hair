const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

function getTimeNow() {
    let now = new Date(); 
    const options = {
    timeZone: 'Asia/Bangkok', // UTC+7 is Bangkok timezone
    hour12: false, // Use 24-hour format
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
    };
    const dateTime = now.toLocaleString('en-GB', options);
    return dateTime;
  }

const sendNotification_Register = (user) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  
    const currentTime = getTimeNow();
    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_auth_log) throw new Error('channel_auth_log not found');

    let message = `**Registered ** ${user.email} (${user.role}) `;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_Login = (user) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_auth_log) throw new Error('channel_auth_log not found');

    let message = `**Login ** ${user.email} (${user.role}) `;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_GetMe = (user) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_auth_log) throw new Error('channel_auth_log not found');

    let message = `**GetUser ** ${user.email} (${user.role})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);
};

const sendNotification_Logout = (user) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_auth_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_AUTH_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('Channel not found');
    if (!channel_auth_log) throw new Error('channel_auth_log not found');

    let message = `**Logout** ${user.email} (${user.role})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_auth_log.send(message);

};

module.exports = {
    sendNotification_Register,
    sendNotification_Login,
    sendNotification_GetMe,
    sendNotification_Logout
};
