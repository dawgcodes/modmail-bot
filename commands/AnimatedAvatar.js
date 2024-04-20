const { SlashCommandBuilder } = require("discord.js");
const { commandshandler } = require("..");

module.exports = new commandshandler.command({
    type: 1,
    structure: new SlashCommandBuilder()
        .setName('animated-avatar')
        .setDescription('Set animated avatar for your bot')
        .addAttachmentOption(option => option.setName('avatar').setDescription('The animated GIF avatar').setRequired(true)),
    run: async (client, interaction) => {
        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        try {
            // Delay the response temporarily while the bot is processing the request
            await interaction.deferReply({ ephemeral: true });

            if (!avatar || avatar.contentType !== 'image/gif') {
                await interaction.reply({
                    content: 'Please provide a valid animated GIF avatar.',
                    ephemeral: true
                });
                return;
            }

            // Change the bot avatar using the given GIF URL
            await client.user.setAvatar(avatar.url);

            // Responds with a message indicating successful avatar setup
            await interaction.editReply({
                content: 'Animated avatar successfully set!',
                ephemeral: true
            });
        } catch (error) {
            console.error('Error setting animated avatar:', error);
            await interaction.reply({
                content: 'An error occurred while setting the animated avatar.',
                ephemeral: true
            });
        }
    }
});
