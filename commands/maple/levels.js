const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const QuickChart = require('quickchart-js');
const { LEVELS_URL } = require('../../utils/URLS.json');
const example_levels = require('../../utils/example_levels');
const chart_config = require('../../utils/chart_config');

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
        const username = interaction.options.getString('username')
        const formattedURL = LEVELS_URL + username;
        const body = await axios.get(formattedURL);
        var levels = body.data;

        if (!levels.length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            function renameKey ( obj, oldKey, newKey ) {
                obj[newKey] = obj[oldKey];
                delete obj[oldKey];
              };
            const chart = await new QuickChart();
            const conf = chart_config;
            levels.forEach( obj => renameKey( obj, 'date', 'x' ) );
            levels.forEach( obj => renameKey( obj, 'level', 'y' ) );
            conf.data.datasets[0].data = levels;

            conf.options.title.text = "Levelling rate of " + username;
            chart
              .setConfig(chart_config)
              .setBackgroundColor("#313339") // discord gray
              .setWidth(800)
              .setHeight(600);
            const shortURL = await chart.getShortUrl();
            console.log(shortURL);

           await interaction.editReply(shortURL);
        }

    },
};