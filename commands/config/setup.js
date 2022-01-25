const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class SetupCommand extends BaseCommand {
    constructor() {
        super('setup', 'config', {
            usage: 'setup',
            description: 'Setup utilities for Piepacker Bot functions',
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

        //Create Ticket Opening Embed
        //Create Auto Voice channels??
        //Change Bot activity
        //Setup important channel links

        let logChannelString =

        const menuEmbed = new MessageEmbed()
            .setTitle("Piepacker Bot setup menu")
            .setDescription("Setup the different channels and roles required in order for the bot to work properly")
            .setColor("#5a46b7")
            .addFields([
                {name: "Log Channel", value: logChannelString, inline: true},
                {name: "Ticket Request Channel", value: `\`\`\`qsdqsd\`\`\``, inline: true},
                {name: "FR Role", value: `\`\`\`qsdqsd\`\`\``, inline: true},
                {name: "EN Role", value: `\`\`\`qsdqsd\`\`\``, inline: true},
                { name: "ES Role", value: "", inline: true}
            ])

        //Channels :
        //LogChannelId
        //TicketRequest ChannelId
        //

    }
}

