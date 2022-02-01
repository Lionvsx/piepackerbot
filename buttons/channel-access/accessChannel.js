const BaseInteraction = require('../../utils/structures/BaseInteraction')
const { MessageEmbed, Permissions } = require('discord.js')

module.exports = class AccessChannel extends BaseInteraction {
    constructor() {
        super('accessChannel', 'channel-access', 'button', {
            userPermissions: [],
            clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS]
        })
    }

    async run(client, interaction, buttonArgs) {
        if (!buttonArgs[1]) return
        const allChannels = interaction.guild.channels.cache;
        const accessChannel = allChannels.get(buttonArgs[1]);


        if (!accessChannel) {
            const embed = new MessageEmbed()
                .setDescription("This ticket doesn't exist anymore.")
                .setColor('#e74c3c')

            interaction.update({
                embeds: [embed],
                components: []
            })
            return;
        }

        try {
            await accessChannel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            })
            accessChannel.send({
                content: `**➡️ | **\`${interaction.user.username}\` joined the ticket !`
            })
            interaction.reply({
                content: `**${client.successEmoji} | **Access granted to \`\`${accessChannel.name}\`\``,
                ephemeral: true
            })
        } catch (err) {
            this.error("An error occurred while trying to access a channel", err)
        }
    }
}