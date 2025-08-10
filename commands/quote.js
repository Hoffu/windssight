const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const createEmbed = (selectedMessage) => {
    return new EmbedBuilder()
        .setColor(0xeef5f5)
        .setURL(selectedMessage?.url)
        .setTitle(selectedMessage?.id)
	    .setDescription(selectedMessage?.content + `\n(c) <@${selectedMessage?.author?.id}>`)
        .setTimestamp(selectedMessage?.createdTimestamp);
}

const rand = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
const messages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Golden Quotes Foundation'),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const channel = interaction.channel;

        if(!messages[channel.id]) {
            messages[channel.id] = [];
        }

        if(messages[channel.id]?.length) {
            let message = await channel.messages
                .fetch({ limit: 1 })
                .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

            while (message) {
                await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => {
                        if(msg.content) messages[channel.id].push(msg);
                    });
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                });
            }
        }

        if(!messages[channel.id]?.length) {
            await interaction.editReply("No previous text messages.");
        } else {
            const selectedMessage = messages[channel.id][rand(0, messages[channel.id].length)];
            const embed = createEmbed(selectedMessage);
            await interaction.editReply({ embeds: [embed] });
        }
        console.log(messages)
	},
};