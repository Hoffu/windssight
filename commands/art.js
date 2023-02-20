const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getPost } = require('../booru/booru');

const createEmbed = (imageURL, postURL, title) => {
    return new EmbedBuilder()
        .setColor(0xeef5f5)
        .setTitle(title)
        .setURL(postURL)
        .setImage(imageURL);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('art')
		.setDescription('Get art by tag')
        .addStringOption(option =>
			option
				.setName('tag')
				.setDescription('Description of a tag. Use space for separating and ! in front of a word to block it. Max = 3 words.')
				.setRequired(true)),
	async execute(interaction) {
        const tag = interaction.options.getString('tag');
        const splittedTag = tag.split(' ');

        const bannedParts = [];
        for(let i = splittedTag.length - 1; i >= 0; i--) {
            if(splittedTag[i].startsWith("!")) {
                bannedParts.push(...splittedTag.splice(i, 1));
            }
        }

        if(splittedTag.length > 3 || splittedTag.length < 1) {
            await interaction.reply({ content: "Incorrect input, please, try again", ephemeral: true });
        } else {
            const postProm = getPost(splittedTag, bannedParts.map(x => x.substring(1)));
            postProm.then(async post => {
                if(!!post.error) {
                    await interaction.reply({ content: post.error, ephemeral: true });
                } else {
                    const embed = createEmbed(
                        post.file_url,
                        "https://danbooru.donmai.us/posts/" + post.id,
                        !!post.file_url ? post.usersTagUsedForSearching.replace(/_/g, ' ') : "Post was deleted due to artist's request, try again"
                    );
    
                    await interaction.reply({ embeds: [embed] });
                }
            });
        }
	},
};