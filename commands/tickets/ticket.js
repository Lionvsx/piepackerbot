const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {Ticket} = require('../../src/schemas/TicketSchema');
const { updateGuildMemberCache, sleep } = require('../../functions/utilitaryFunctions')

module.exports = class CommandsCommand extends BaseCommand {
    constructor() {
        super('ticket', 'tickets', {
            usage: 'ticket <subcommand> <opt argument>',
            description: `Command Interaction`,
            categoryDisplayName: '✉️ Tickets'
        }, {
            clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
            userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
            home: true
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
            .addSubcommand(subcommand =>
                subcommand.setName("add")
                    .setDescription('Add a user to this ticket')
                    .addUserOption(option =>
                        option.setName('user')
                            .setRequired(true)
                            .setDescription('User to add to this ticket')
                        )
                )
            .addSubcommand(subcommand =>
                subcommand.setName('remove')
                    .setDescription('Remove a user from this ticket')
                    .addUserOption(option =>
                        option.setName('user')
                            .setRequired(true)
                            .setDescription('User to remove from this ticket')
                        )
                )
            .addSubcommand(subcommand =>
                subcommand.setName('close')
                    .setDescription('Deletes the ticket')
                )
            .addSubcommand(subcommand =>
                subcommand.setName('claim')
                    .setDescription('Mark this ticket as claimed by yourself')
                )
            .addSubcommand(subcommand => 
                subcommand.setName('exit')
                    .setDescription('Leave the ticket')
                )
            .addSubcommand(subcommand =>
                subcommand.setName('transcript')
                    .setDescription('Create ticket message history transcript')
                )
            
    }
    async run(client, interaction, options) {

        const ticket = await Ticket.findOne({ archive: false, ticketChannelId: interaction.channel.id });
        if (!ticket) return client.replyError(interaction, 'This channel is not a ticket');

        switch (options.getSubCommand()) {
            case 'claim':
                client.replyWarning(interaction, "This function isn't available yet")
                break;
            case 'add':
                let user = options.getUser('user');
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
                        this.error("An error has occured while trying to add a user to a ticket", err);
                    })
                

                break;
            case 'remove':
                let user = options.getUser('user')

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
                        this.error("An error has occured while trying to remove a user from a ticket", err);
                    })
                break;
            case 'close':
                let deleteEmbed = new MessageEmbed()
                    .setDescription("Deleting ticket in 5 seconds")
                    .setColor('ff5733')
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
                    this.error("An error has occured while trying to delete a ticket", err);
                }
                break;
            case 'exit':
                let leaveEmbed = new MessageEmbed()
                    .setDescription(`\`${message.author.username}\` just left the ticket 👋`)
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
                    this.error("An error was occured while trying to leave a ticket", err);
                }
                break;
            case 'transcript':
                client.replyWarning(interaction, "This function isn't available yet")
                break;
            case 'pin':
                client.replyWarning(interaction, "This function isn't available yet")
                break;
            default:
                client.replyError(interaction, 'No option was selected')
                break;
        }
    }
}