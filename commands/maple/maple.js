const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const Canvas = require('@napi-rs/canvas');
const { AVATAR_URL, INFO_URL } = require('../../utils/URLS.json');
const example_info = require('../../utils/example_info');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('maple')
        .setDescription('Looks up character.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('ign of character')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const username = interaction.options.getString('username');
        const avatarURL = AVATAR_URL + username;
        const infoURL = INFO_URL + username;
        try {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // WHILE TESTING WE JUST USE THE EXAMPLE DATA SO WE DONT KEEP PINGING THE SERVER
            // edit: RELEASE THE FLOODGATES
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            // get info
            
            const body = await axios.get(infoURL);
            const info = body.data;
            
            //const info = example_info;

            // create canvas + background
            const canvas = Canvas.createCanvas(600, 300);
            const context = canvas.getContext('2d');
            const background = await Canvas.loadImage('./utils/backgrounds.png');
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // theres a redirect to maplestory.io, so we grab that URL to generate the avatar png
            
            const avatarIMG = await axios.get(avatarURL);
            const redirectURL = avatarIMG.request.res.responseUrl;
            const avatar = await Canvas.loadImage(redirectURL);
            
            //const avatar = await Canvas.loadImage('./utils/avatar.jpg');

            // Draw a rectangle with some dimensions....
            const fontsize = 22;
            context.font = fontsize + 'px sans-serif';
            const textLeftAlign = 40;
            const textTopAlign = 30 + fontsize;
            const offset = fontsize + 5;
            context.fillStyle = "rgba(0, 0, 0, 0.4)";
            context.fillRect(textLeftAlign / 2 , textLeftAlign / 2, 250, offset * 9 );

            // Text
            context.fillStyle = '#ffffff';
            const job = info.job.replace("(Ice/Lightning)", "(I/L)").replace("(Fire/Poison)", "(F/P)");
            const guild = info.guild.length == 0 ? "N/A" : info.guild;
            context.fillText(info.name, textLeftAlign, textTopAlign);
            context.fillText("Job: " + job, textLeftAlign, textTopAlign + offset);
            context.fillText("Guild: " + guild, textLeftAlign, textTopAlign + offset * 2);
            context.fillText("Level: " + info.level, textLeftAlign, textTopAlign + offset * 3);
            context.fillText("Exp: " + info.exp, textLeftAlign, textTopAlign + offset * 4);
            context.fillText("Fame: " + info.fame, textLeftAlign, textTopAlign + offset * 5);
            context.fillText("Cards: " + info.cards, textLeftAlign, textTopAlign + offset * 6);
            context.fillText("Quests: " + info.quests, textLeftAlign, textTopAlign + offset * 7);

            // TODO: CANNOT FIX THE CHARACTERS TO THE FRICKIN GROUND
            // draw avatar
            const multiplier = 1.8;
            const centeredHeight = canvas.height - (avatar.height * (multiplier + 0.2));
            context.drawImage(avatar, 350, centeredHeight, 
                avatar.width * multiplier, avatar.height * multiplier);
        
            // Use the helpful Attachment class structure to process the file for you
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'character.png' });
            await interaction.editReply({ files: [attachment] });
        } catch (error) {
            console.log(error);
            await interaction.followUp( `No player found for **${username}**.`);
        }

    },
};