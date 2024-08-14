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
        //console.log(formattedURL);

        // TEST: COMMENTING OUT THESE TWO
        // const body = await axios.get(formattedURL);
        // const levels = body.data;
        var levels = example_levels;

        //console.log(levels);
        if (!levels.length){
            await interaction.followUp( `No player found for **${username}**.`);
        } else {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // WHILE TESTING WE JUST USE THE EXAMPLE DATA SO WE DONT KEEP PINGING THE SERVER
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            function renameKey ( obj, oldKey, newKey ) {
                obj[newKey] = obj[oldKey];
                delete obj[oldKey];
              };
            
            levels.forEach( obj => renameKey( obj, 'date', 'x' ) );
            levels.forEach( obj => renameKey( obj, 'level', 'y' ) );
            const chart = await new QuickChart();
            const conf = chart_config;
            //console.log("test: "+ conf.data.datasets[0].data.length);
            conf.data.datasets[0].data = example_levels;

            console.log("test2: "+ conf.data.datasets[0].data.length);
            conf.options.title.text = "Levelling rate of " + username;
            chart
              .setConfig(chart_config)
              .setWidth(800)
              .setHeight(600);
            const shortURL = await chart.getShortUrl();
            console.log(shortURL);

            // Use the helpful Attachment class structure to process the file for you
            //const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'levels.png' });
            await interaction.editReply(shortURL);
        }

    },
};