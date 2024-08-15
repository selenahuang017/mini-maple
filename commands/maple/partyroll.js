const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('partyroll')
        .setDescription('@roll 100 for all party members')
        .addStringOption(option =>
            option.setName('names')
                .setDescription('input all names separated by space or comma')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const names = interaction.options.getString('names')
                                .split(/[ ,]+/)
                                .filter(name => name);
        if (names.length > 10){
            await interaction.followUp("Please try again with a smaller party (<10)");
        } else {
            function getRandomInt() { return Math.floor(Math.random() * 100);}
            var output = "You have rolled a 100-sided dice for " + names.join(", ") + "\n\n";
            var map = new Map();
            names.forEach(function (name) {
                var roll = getRandomInt();
                map.set(roll, name);
                output += name + " has rolled a " + roll + "!\n";
            });
            output += "\nIn order:\n";
            const sorted = new Map([...map.entries()].sort().reverse());
            var order = 1;
            sorted.forEach(function (name) {
                output += order++ + " - " + name + ", ";
            });
            await interaction.editReply(output.substring(0, output.length - 2));
        }
    },
};