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
const messages = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Golden Quotes Foundation'),
	async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        
        if(messages.length === 0) {
            let i = 100;
            const channel = client.channels.cache.get("424535278816854017");

            let message = await channel.messages
                .fetch({ limit: 1 })
                .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

            while (message && i > 0) {
                i--;
                await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => {
                        if(msg.content) messages.push(msg);
                    });
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                });
            }
        }

        const selectedMessage = messages[rand(0, messages.length)];
        message = null;

        const embed = createEmbed(selectedMessage);
        await interaction.editReply({ embeds: [embed] });
	},
};