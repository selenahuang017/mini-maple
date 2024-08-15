const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of commands for Mini Maple'),
	async execute(interaction) {
		var help = "Current list of maple commands: \n" +
			"/maple: searches a character's info and avatar\n" + 
			"/level: displays a character's levelling history\n" + 
			"/servertime: displays server time in UTC\n" + 
			"/partyroll: @roll 100 for a party of up to 10 members\n" + 
			"\nTo be decommissioned: \n" + 
			"/avatar: displays a character's avatar\n" + 
			"/info: displays a character's info in JSON\n" + 
			"/echo: echoes input bc why not\n" +
			"\nGeneral commands:\n" + 
			"/help: displays commands list\n" +
			"/ping: pong!\n" ;
		await interaction.reply(help);
		
	},
};