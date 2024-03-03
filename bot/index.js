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
