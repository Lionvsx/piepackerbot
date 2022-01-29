const BaseCommand = require('../../utils/structures/BaseCommand')
const { Permissions, MessageEmbed} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Ticket = require('../../src/schemas/TicketSchema');

module.exports = class TicketExitCommand extends BaseCommand {
    constructor() {
        super('ticket-exit', 'tickets', {
            usage: "ticket-exit",
            description: `Leave the ticket`,
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

        let leaveEmbed = new MessageEmbed()
            .setDescription(`\`${interaction.user.username}\` just left the ticket 👋`)
            .setColor('#f39c12')
        try {
            interaction.channel.permissionOverwrites.delete(interaction.user.id)
            interaction.channel.send({
                embeds: [leaveEmbed]
            })
            this.log("User left a ticket", {
                user: interaction.user.username,
                ticketName: ticket.name
            })
        } catch (err) {
            this.error("An error occurred while trying to leave a ticket", err);
        }
    }
}