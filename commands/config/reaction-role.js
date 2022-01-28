const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class SetupCommand extends BaseCommand {
    constructor() {
        super('reaction-role', 'config', {
            usage: 'reaction-role',
            description: 'Create reaction based role assignment',
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
            .addStringOption(option =>
                option.setName("mode")
                    .setDescription("Select command mode")
                    .addChoice("Create", "ras_create")
                    .addChoice("Delete", "ras_delete")
                    .setRequired(true))
    }
    async run(client, interaction, options) {
        switch (options.get('mode').value) {
            case "ras_delete": {

                break;
            }
            case "ras_create": {

                break;
            }
            default: {
                break;
            }
        }
    }
}

