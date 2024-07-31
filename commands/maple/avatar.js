const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const Canvas = require('@napi-rs/canvas');
const { AVATAR_URL } = require('../../utils/URLS.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Looks up character avatar.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const formattedURL = AVATAR_URL + interaction.options.getString('username');
        try {
            const body = await axios.get(formattedURL);
            
            // create canvas
            const canvas = Canvas.createCanvas(500, 300);
            const context = canvas.getContext('2d');
            
            // theres a redirect to maplestory.io, so we grab that URL to generate the png
            const redirectURL = body.request.res.responseUrl;
            const avatar = await Canvas.loadImage(redirectURL);
            //console.log("Width:" + avatar.width * 2 + ", Height: " + avatar.height * 2);
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