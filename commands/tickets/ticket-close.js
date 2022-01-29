const BaseCommand = require('../../utils/structures/BaseCommand')
const { Permissions, MessageEmbed} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Ticket = require('../../src/schemas/TicketSchema');
const {sleep} = require("../../functions/utilitaryFunctions");

module.exports = class TicketCloseCommand extends BaseCommand {
    constructor() {
        super('ticket-close', 'tickets', {
            usage: "ticket-close",
            description: `Close this ticket`,
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

        let deleteEmbed = new MessageEmbed()
            .setDescription("Deleting ticket in 5 seconds")
            .setColor('#ff5733')
        interaction.reply({
            embeds: [deleteEmbed]
        })

        await sleep(5000);
        try {
            ticket.archive = true;
            await ticket.save();
            interaction.channel.delete();
            this.log('A ticket was deleted', {
                ticketName: ticket.name,
                operator: interaction.user.username
            })
        } catch (err) {
            this.error("An error occurred while trying to delete a ticket", err);
        }
    }
}