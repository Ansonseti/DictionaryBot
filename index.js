const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, channel, logs } = require('./config.json');
const chalk = require('chalk');
const db = require('quick.db');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', (client) => {
    console.log('Ready!');
    console.log(chalk.blue('Bot is created by Nothingness!'))
    console.log(chalk.green('https://nothingness.ml'))
    client.user.setActivity('Created by Nothingness', { type: 'PLAYING' });
    setInterval(function () {
        const count = db.get('count');
        db.add('count', '1');
        fetch('https://random-word-api.herokuapp.com/all')
            .then(result => result.json())
            .then(json => {
                if (!channel.manageable) {
                    console.log(chalk.red('Channel is not manageable!'))
                    client.channel.cache.get(logs).send('Channel is not manageable!');
                    throw new Error('Channel is not manageable!');
                }
                channel.setName(json[count])
            })
            .catch(err => {
                console.error(err);
                client.channels.cache.get(logs).send('We can\'t fetch the data, try again later');
            });
    }, 600000);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);