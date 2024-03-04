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

const sendNotification_GetAllRestaurants = (email,role) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_restaurant_log) throw new Error('channel_restaurant_log not found');

    let message = `**Get All Restaurants** ${email} (${role})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_restaurant_log.send(message);
};

const sendNotification_GetOneRestaurant = (email,role,nameRestaurant,address) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_restaurant_log) throw new Error('channel_restaurant_log not found');

    let message = `**Get One Restaurant** ${email} (${role}) -> ${nameRestaurant} (${address})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_restaurant_log.send(message);
};

const sendNotification_CreateRestaurant = (email,role,nameRestaurant,address) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_restaurant_log) throw new Error('channel_restaurant_log not found');

    let message = `**Create Restaurant** ${email} (${role}) -> ${nameRestaurant} (${address})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_restaurant_log.send(message);
};

const sendNotification_UpdateRestaurant = (email,role,restaurantId) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_restaurant_log) throw new Error('channel_restaurant_log not found');

    let message = `**Update Restaurant** ${email} (${role}) : ${restaurantId}`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_restaurant_log.send(message);
};

const sendNotification_DeleteRestaurant = (email,role,restaurantId) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_restaurant_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESTAURANT_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_restaurant_log) throw new Error('channel_restaurant_log not found');

    let message = `**Delete Restaurant** ${email} (${role}) : ${restaurantId}`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_restaurant_log.send(message);
};

module.exports = {
    sendNotification_GetAllRestaurants,
    sendNotification_GetOneRestaurant,
    sendNotification_CreateRestaurant,
    sendNotification_UpdateRestaurant,
    sendNotification_DeleteRestaurant
};
