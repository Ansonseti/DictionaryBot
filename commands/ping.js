const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Wots my ping lmfao'),
	async execute(interaction) {
		return interaction.reply(`Pong! Latency ${Date.now() - interaction.createdTimestamp}ms, API Latency ${Math.round(interaction.client.ws.ping)}`);
	},
};