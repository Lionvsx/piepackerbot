const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class CommandsCommand extends BaseCommand {
    constructor() {
        super('ticket', 'tickets', {
            usage: 'ticket <subcommand> <opt argument>',
            description: `Command Interaction`,
            categoryDisplayName: '✉️ Tickets'
        }, {
            clientPermissions: [],
            userPermissions: [],
            home: true
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
            .addSubCommand(subcommand => 
                subcommand.setName())
    }
    async run(client, interaction, options) {

    }
}