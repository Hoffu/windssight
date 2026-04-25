const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel,createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('andrew')
        .setDescription('Bot joins to the voice chat and chill there for 5-15 minutes'),
    async execute(interaction) {
        try {
            const player = createAudioPlayer();
            const resource = createAudioResource('./sounds/andrew.mp3');

            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            guild.members.me.voice.setMute(false);
            connection.subscribe(player);
            player.play(resource);

            setTimeout(() => {
                guild.members.me.voice.setMute(true);
            }, 7000);

            const rand = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const time = rand(5000, 15000);

            setTimeout(() => {
                guild.members.me.voice.setMute(false);
                connection.destroy();
            }, time);
        } catch (error) {
            console.log(error);
        }
    },
};