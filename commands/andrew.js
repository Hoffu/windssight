const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel,createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('andrew')
        .setDescription('Bot joins to the voice chat and chill there for 5-15 minutes'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: false });
            const player = createAudioPlayer();
            const resource = createAudioResource('./sounds/andrew.mp3');

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const selfVoice = interaction.guild.members.me.voice;

            selfVoice.setMute(false);
            selfVoice.setDeaf(false);
            connection.subscribe(player);
            player.play(resource);

            const soundDelay = 7000;
            setTimeout(() => {
                selfVoice.setMute(true);
                selfVoice.setDeaf(true);
            }, soundDelay);

            const rand = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const time = rand(300000, 900000);

            setTimeout(async () => {
                await Promise.all([
                    selfVoice.setMute(false),
                    selfVoice.setDeaf(false)
                ]);
                connection.destroy();
            }, time + soundDelay);
            await interaction.deleteReply();
        } catch (error) {
            console.log(error);
        }
    },
};