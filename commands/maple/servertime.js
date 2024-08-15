const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('servertime')
        .setDescription('Prints server time'),
    async execute(interaction) {
        const now = new Date(Date.now());
        await interaction.reply("Server Time: " + now.toUTCString());
    },
};