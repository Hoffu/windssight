const { SlashCommandBuilder } = require('discord.js');

const members = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('Takes a random participant and assigns him a name')
        .addStringOption(option =>
            option.setName('nickname')
            .setDescription('New nickname(by default HandMasta)')
            .setRequired(false)),
    async execute(interaction) {

        let newNickname = interaction.options.getString('nickname');

        if(!newNickname) {
            newNickname = 'HandMasta';
        }

        if(newNickname.length > 32) {
            return interaction.reply({
                content: 'Ты долбоеб? Никнейм не может быть длиннее 32 символов.', 
				ephemeral: true
            })
        }

        const channel = interaction.channel;
        if(!members[channel.id]) {
            members[channel.id] = [];
        }

        try {
            if(!members[channel.id].length) {
                const members = await interaction.guild.members.fetch();
                members[channel.id] = members.filter(member => !member.user.bot);
            }

            await interaction.deferReply({ ephemeral: false });

            const randomMember = members[channel.id].random();
            const prevNickname = randomMember;

            await randomMember.setNickname(newNickname);
            await interaction.editReply({
                content: `Чурке ${prevNickname} был изменен ник на ${newNickname}`
            });
        } catch (error) {
            console.log(error)

            if(error.code === 50013) {
                await interaction.editReply({
                    content: 'У бота недостаточно прав для изменения никнейма или у юзера права выше чем у бота', 
					ephemeral: true 
                });
            } else {
                await interaction.editReply({
                    content: `Ошибка при изменении никнейма: ${error.message}`, 
					ephemeral: true 
                });
            }
        }
    },
};