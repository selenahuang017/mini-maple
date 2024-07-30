const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const Canvas = require('@napi-rs/canvas');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Looks up character avatar.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const username = interaction.options.getString('username');
        const MAPLE_URL = "https://maplelegends.com/api/getavatar?name=";
        const formattedURL = MAPLE_URL + username;
        try {
            const body = await axios.get(formattedURL);
            
            // create canvas
            const canvas = Canvas.createCanvas(200, 200);
            const context = canvas.getContext('2d');
            
            // theres a redirect to maplestory.io, so we grab that URL to generate the png
            const redirectURL = body.request.res.responseUrl;
            const avatar = await Canvas.loadImage(redirectURL);
        
            // draw avatar
            context.drawImage(avatar, 0, 0, avatar.width * 2, avatar.height * 2);
        
            // Use the helpful Attachment class structure to process the file for you
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'character.png' });
            await interaction.editReply({ files: [attachment] });
        } catch (error) {
            console.log(error);
            await interaction.followUp( `No player found for **${username}**.`);
        }

    },
};