const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const ratelimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const restaurant = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservation  = require('./routes/reservations');
const payments = require('./routes/payments');

const limiter = ratelimit({
    windowMs: 10*60*1000, //10 mins
    max: 1000
});

//Load env vars
dotenv.config({path : 'config/config.env'});

//connect to db
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use('/api/v1/restaurants', restaurant);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservation );
app.use('/api/v1/payments',payments);

//Discord bot API
const {Client, Intents, GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages , 
        GatewayIntentBits.MessageContent
    ],
});


client.on('messageCreate', (message) => {
    // console.log(message.content);
    if(message.author.bot) return;
    if(message.content.startsWith('create')){
        const url = message.content.split('create')[1];
        return message.reply({
            content: `Generting Short ID for ${url}`
        });
    }
    message.reply({
        content: 'Hello, I am a bot!'
    });
});

client.on('interactionCreate', async interaction => {
  console.log(interaction)
  interaction.reply('Pong!');
});

client.login(process.env.DISCORD_BOT_TOKEN);



//Set static folder
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('server running in ',process.env.NODE_ENV, ' mode on port ', PORT));

//handle unhandled promise rejection
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server and exit process
    server.close(()=> process.exit(1));
});
