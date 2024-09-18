const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
        await wait(1_500);
        await interaction.followUp({ content: 'SURPRISE MOTHERFOCKER!', ephemeral: true });
	},
};