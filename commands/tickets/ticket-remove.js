const BaseCommand = require('../../utils/structures/BaseCommand')
const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Ticket = require('../../src/schemas/TicketSchema');

module.exports = class TicketRemoveCommand extends BaseCommand {
    constructor() {
        super('ticket-remove', 'tickets', {
            usage: "ticket-remove [user]",
            description: `Remove a user from this ticket`,
            categoryDisplayName: '✉ Tickets'
        }, {
            clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
            userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
            home: true
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
            .addUserOption(option =>
                option.setName('user')
                    .setDescription("User to remove from this ticket")
                    .setRequired(true)
                )
    }

    /**
     *
     * @param client
     * @param interaction
     * @param options
     * @returns {Promise<void>}
     */
    async run(client, interaction, options) {
        const ticket = await Ticket?.findOne({ archive: false, ticketChannelId: interaction.channel.id });
        if (!ticket) return client.replyError(interaction, 'This channel is not a ticket');

        const user = options.getUser('user')

        interaction.channel.permissionOverwrites.delete(user)
            .then(channel => {
                this.log("A user was removed from a ticket", {
                    ticketName: ticket.name,
                    channelName: channel.name,
                    removedUser: user.username,
                    operator: interaction.user.username
                })
            })
            .catch(err => {
                this.error("An error has occurred while trying to remove a user from a ticket", err);
            })

        await client.replySuccess(interaction, `\`${user.username}\` was removed from the ticket !`)
    }
}