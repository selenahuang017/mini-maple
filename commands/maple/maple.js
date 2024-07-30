const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('maple')
        .setDescription('Looks up the character.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const username = interaction.options.getString('username');
        const MAPLE_URL = "https://maplelegends.com/api/character?name=";
        const formattedURL = MAPLE_URL + username;
        //console.log(formattedURL);

        const body = await axios.get(formattedURL);
        const player = body.data;
        console.log(player);
        console.log()
        if (!Object.keys(player).length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            await interaction.followUp(JSON.stringify(player));
        }

    },
};