const Discord = require('discord.js');
const client = require('./index');
const dotenv = require('dotenv');
dotenv.config({path : 'config/config.env'});

const sendNotification_GetAllRestaurants = (email) => {
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

    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    // const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  

    if (!channel_main_log) throw new Error('channel_main_log not found');

    let message = `**Get All Restaurants** ${email} `;
    message = `[${dateTime}] ${message}`
    channel_main_log.send(message);
    // channel_restaurant_log.send(message);

};


module.exports = {
    sendNotification_GetAllRestaurants,

};
