const BaseCommand = require('../../utils/structures/BaseCommand')
const {Permissions} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super('invite', 'utilities', {
            usage: 'invite',
            description: 'Generate invitation link',
            categoryDisplayName: '🔧 Utilities'
        }, {
            clientPermissions: [],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            home: false
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {
        const link = client.generateInvite({
            permissions: [
                Permissions.FLAGS.ADMINISTRATOR
            ],
            scopes: ['applications.commands', 'bot'],
        });

        interaction.reply(`**📩 | **Click [here](${link}) to invite to bot`)
    }
}

