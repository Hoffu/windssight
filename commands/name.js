const { SlashCommandBuilder } = require('discord.js');

let isMembersUpdated = false;

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

        try {
            await interaction.deferReply({ ephemeral: false });
            if(!isMembersUpdated) {
                await interaction.guild.members.fetch();
                isMembersUpdated = true;
            }

            const guild = interaction.guild;
            const members = guild.members.cache.filter(member => !member.user.bot);
            const randomMember = members.random();
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