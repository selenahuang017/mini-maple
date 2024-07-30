const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription("Looks up the character's levels.")
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const username = interaction.options.getString('username');
        const MAPLE_URL = "https://maplelegends.com/api/getlevels?name=";
        const formattedURL = MAPLE_URL + username;
        //console.log(formattedURL);

        const body = await axios.get(formattedURL);
        const levels = body.data;
        console.log(levels);
        if (!levels.length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            await interaction.followUp(JSON.stringify(levels[0]));
        }

    },
};