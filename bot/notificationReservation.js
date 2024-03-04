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

const sendNotification_GetAllReservations = (email,role) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_Reservation_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESERVATION_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_Reservation_log) throw new Error('channel_Reservation_log not found');

    let message = `**Get All Reservations** ${email} (${role})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_Reservation_log.send(message);
};

const sendNotification_GetOneReservation = (email,role,restaurantName,restaurantAddress,resvDate) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_Reservation_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESERVATION_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_Reservation_log) throw new Error('channel_Reservation_log not found');

    let message = `**Get One Reservation** ${email} (${role}) -> ${restaurantName} (${restaurantAddress}) (${resvDate.toString().substring(0,24)})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_Reservation_log.send(message);
};

const sendNotification_CreateReservation = (email,role,reservationDate,restaurantName,restaurantAddress) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_Reservation_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESERVATION_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_Reservation_log) throw new Error('channel_Reservation_log not found');

    let message = `**Create Reservations** ${email} (${role}) -> ${restaurantName} (${restaurantAddress}) (${reservationDate.toString().substring(0,24)})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_Reservation_log.send(message);
};

const sendNotification_UpdateReservation = (email,role,ReservationId ,restaurantName , restaurantAddress ,resvDate) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_Reservation_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESERVATION_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_Reservation_log) throw new Error('channel_Reservation_log not found');

    let message = `**Update Reservation** ${email} (${role}) : ${ReservationId} -> ${restaurantName} (${restaurantAddress}) (${resvDate.toString().substring(0,24)})`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_Reservation_log.send(message);
};

const sendNotification_DeleteReservation = (email,role,ReservationId) => {
    const channel_main_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_MAIN_LOG);  
    const channel_Reservation_log = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID_RESERVATION_LOG);  
    const currentTime = getTimeNow();

    if (!channel_main_log) throw new Error('channel_main_log not found');
    if (!channel_Reservation_log) throw new Error('channel_Reservation_log not found');

    let message = `**Delete Reservation** ${email} (${role}) : ${ReservationId}`;
    message = `[${currentTime}] ${message}`
    channel_main_log.send(message);
    channel_Reservation_log.send(message);
};

module.exports = {
    sendNotification_GetAllReservations,
    sendNotification_GetOneReservation,
    sendNotification_CreateReservation,
    sendNotification_UpdateReservation,
    sendNotification_DeleteReservation
};
