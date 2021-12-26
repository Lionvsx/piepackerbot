const BaseCommand = require('../../utils/structures/BaseCommand')
const { Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Ticket } = require('../../src/schemas/TicketSchema');

module.exports = class TicketTranscriptCommand extends BaseCommand {
    constructor() {
        super('ticket-transcript', 'tickets', {
            usage: "ticket-transcript",
            description: `Create ticket message history transcript`,
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
    }
    async run(client, interaction, options) {
        const ticket = await Ticket?.findOne({ archive: false, ticketChannelId: interaction.channel.id });
        if (!ticket) return client.replyError(interaction, 'This channel is not a ticket');

        client.replyWarning(interaction, "This function isn't available yet")
    }
}