const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const attachment = new AttachmentBuilder('./pictures/0829e028c75fee0053a2c70ebd455209.jpg', { name: '0829e028c75fee0053a2c70ebd455209.jpg' });

const embed = new EmbedBuilder()
	.setColor(0xeef5f5)
	.setImage('attachment://0829e028c75fee0053a2c70ebd455209.jpg');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('churka')
		.setDescription('idk')
        .addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to mention')
				.setRequired(true)),
	async execute(interaction) {
        const target = interaction.options.getUser('target');

		await interaction.reply({ content: `<@${target.id}>`, embeds: [embed], files: [attachment] });
	},
};