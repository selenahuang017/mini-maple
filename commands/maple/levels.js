const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { LEVELS_URL } = require('../../utils/URLS.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription("Looks up the character's levels.")
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const formattedURL = LEVELS_URL + interaction.options.getString('username');
        //console.log(formattedURL);

        const body = await axios.get(formattedURL);
        const levels = body.data;
        //console.log(levels);
        if (!levels.length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            await interaction.followUp(JSON.stringify(levels[0]));
        }

    },
};