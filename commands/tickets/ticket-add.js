const BaseCommand = require('../../utils/structures/BaseCommand')
const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Ticket } = require('../../src/schemas/TicketSchema');

module.exports = class TicketAddCommand extends BaseCommand {
    constructor() {
        super('ticket-add', 'tickets', {
            usage: "ticket-add [user]",
            description: `Add user to this ticket`,
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
                option.setName("user")
                    .setDescription("User to add to this ticket")
                    .setRequired(true)
                )

    }
    async run(client, interaction, options) {
        const ticket = await Ticket?.findOne({ archive: false, ticketChannelId: interaction.channel.id });
        if (!ticket) return client.replyError(interaction, 'This channel is not a ticket');

        const user = options.getUser('user');
        interaction.channel.permissionOverwrites.create(user, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
            .then(channel => {
                this.log("A user was added to a ticket", {
                    ticketName: ticket.name,
                    channelName: channel.name,
                    addedUser: user.username,
                    operator: interaction.user.username
                })
            })
            .catch(err => {
                this.error("An error has occurred while trying to add a user to a ticket", err);
            })
    }
}