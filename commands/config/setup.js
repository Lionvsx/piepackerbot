const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class SetupCommand extends BaseCommand {
    constructor() {
        super('setup', 'config', {
            usage: 'setup',
            description: 'Open setup utilities',
            categoryDisplayName: '⚙️ Config'
        }, {
            clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            home: false
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {
        

    }
}

