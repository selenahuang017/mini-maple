const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Canvas = require('@napi-rs/canvas');
const Chart = require('chart.js/auto');
const QuickChart = require('quickchart-js');
const { LEVELS_URL } = require('../../utils/URLS.json');
const example_levels = require('../../utils/example_levels');

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
            const example_data = [{x: '2024-05-07 16:14:51', y: 20}, {x: '2024-05-07 16:24:05', y: 10}];
            console.log(JSON.stringify( levels ));
            console.log(JSON.stringify( example_data ));
            const chart = new QuickChart();
            const config = {
                type: 'scatter',
                data: {
                    labels: 'Levels Timescale',
                    datasets: [{
                        data: [{x: '2024-05-07 16:14:51', y: 20}, {x: '2024-05-07 16:24:05', y: 10}],
                    }],
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                        }
                    }, 
                }
            };
            chart
              .setConfig({
                type: 'scatter',
                data: {
                    labels: 'Levels Timescale',
                    datasets: [{
                        data: [{x: 10, y: 20}, {x: 15, y: 10}],
                    }],
                },
                options: {}
            })
              .setWidth(600)
              .setHeight(300);
            const shortURL = await chart.getShortUrl();
            console.log(shortURL);
            //const level_chart = await Canvas.loadImage(chart.getShortUrl());
            //context.drawImage(level_chart, 0, 0, canvas.width, canvas.height);

            // Use the helpful Attachment class structure to process the file for you
            //const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'levels.png' });
            await interaction.editReply(shortURL);
        }

    },
};