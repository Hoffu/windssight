const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const createEmbed = (quote, author, date) => {
    return new EmbedBuilder()
        .setDescription(`"${quote}"`)
	    .setFooter({ text: `(c) ${author}` })
        .setTimestamp(date);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Golden Quotes Foundation'),
	async execute(interaction, client) {
        const channel = client.channels.cache.get("424535278816854017");
        console.log(channel)
        const rand = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);
        let messages = [];
        let i = rand(1, 100);

        let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

        while (message && i > 0) {
            i--;
            await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
                messagePage.forEach(msg => messages.push(msg));
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        }

        const selectedMessage = messages[rand(0, messages.length)];
        messages = null;
        message = null;

        const embed = createEmbed(
            selectedMessage.content,
            selectedMessage.author.tag,
            selectedMessage.createdTimestamp
        );

        await interaction.reply({ embeds: [embed] });
	},
};