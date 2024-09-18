const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { INFO_URL } = require('../../../utils/URLS.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Looks up information on the character.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const formattedURL = INFO_URL + interaction.options.getString('username');

        const body = await axios.get(formattedURL);
        const player = body.data;
        //console.log(player);
        if (!Object.keys(player).length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            await interaction.followUp(JSON.stringify(player));
        }

    },
};