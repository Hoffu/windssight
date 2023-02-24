const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Jimp = require('jimp');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lobster')
		.setDescription('funny font isn\'t it')
        .addStringOption(option =>
			option
				.setName('text')
				.setDescription('ur text')
				.setRequired(true))
        .addStringOption(option =>
			option
				.setName('url')
				.setDescription('url to image')
				.setRequired(false))
        .addAttachmentOption(option => 
            option
                .setName('image')
                .setDescription('if you want to attach the image, but url > attachment')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('black or white, on default will be white')
                .setRequired(false)),
	async execute(interaction) {
        const usersUrl = interaction.options.getString('url');
        const img = interaction.options.getAttachment('image');
        const color = interaction.options.getString('color');

        if(!usersUrl && !img) {
            await interaction.reply({ content: "Please, attach the image via url or attachments", ephemeral: true });
        } else {
            const url = !!usersUrl ? usersUrl : img.url;
            const text = interaction.options.getString('text');
            const font = color === "black" ? "./fonts/lobster/lobster-black-46/lobster-black-46.fnt" :  "./fonts/lobster/lobster-white-46/lobster-white-46.fnt";

            console.log(url)
            Jimp.read(url, (err, image) => {
                if (err) throw err;

                Jimp.loadFont(font).then((font) => {
                    const extension = "." + image.getExtension();
                    image.print(
                        font,
                        0,
                        0,
                        {
                            text: text,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
                        },
                        image.bitmap.width,
                        image.bitmap.height - 5
                    );
                    image.writeAsync('./pictures/output' + extension).then(async res => {
                        const attachment = new AttachmentBuilder('./pictures/output' + extension, { name: 'output' + extension });

                        const embed = new EmbedBuilder()
                            .setColor(0xeef5f5)
                            .setImage('attachment://output' + extension);

                        await interaction.reply({ embeds: [embed], files: [attachment]});
                    });
                });
            });
        }
	},
};