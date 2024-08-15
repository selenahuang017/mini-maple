const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('any text you want')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply("Mini Maple says: " + interaction.options.getString('input') + " :3");
    },
};