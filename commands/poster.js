const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Jimp = require('jimp');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poster')
		.setDescription('if you have based opinion')
        .addStringOption(option =>
			option
				.setName('text')
				.setDescription('Based text here')
				.setRequired(true)),
	async execute(interaction) {
        const text = interaction.options.getString('text');

		Jimp.read('./pictures/F8U4AyhcRaI.jpg', (err, image) => {
			if (err) throw err;

			Jimp.loadFont("./fonts/calibri/calibri-black-18.fnt").then(async (font) => {
				image.print(
					font,
					100,
					440,
					text,
					340
				);
				image.writeAsync('./pictures/output.jpg').then(async res => {
					const attachment = new AttachmentBuilder('./pictures/output.jpg', { name: 'output.jpg' });

					const embed = new EmbedBuilder()
						.setColor(0xeef5f5)
						.setImage('attachment://output.jpg');

					await interaction.reply({ embeds: [embed], files: [attachment]});
				});
			});
		});
	},
};