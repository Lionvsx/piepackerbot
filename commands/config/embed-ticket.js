const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions, MessageActionRow} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {createEmojiButton} = require("../../functions/messageComponents");

require('dotenv').config();

module.exports = class EmbedLanguage extends BaseCommand {
    constructor() {
        super('embed-ticket', 'config', {
            usage: 'embed-ticket',
            description: 'Sends ticket embed',
            categoryDisplayName: '⚙️ Config'
        }, {
            clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            home: true
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {
        const embed = new MessageEmbed()
            .setTitle("TICKET HELP CENTER")
            .setDescription("If you need assistance from Piepacker's staff, please click the button corresponding to the language you want. A member of the staff will answer you as soon as possible.")
            .setColor("#e0a650")

        await client.replyLoading(interaction, "Sending embed...")

        interaction.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([
                createEmojiButton(`newTicket|🇫🇷FR`, "Français", "SUCCESS", "🇫🇷"),
                createEmojiButton(`newTicket|🇬🇧EN`, "English", "SUCCESS", "🇬🇧"),
                createEmojiButton(`newTicket|🇪🇸ES`, "Español", "SUCCESS", "🇪🇸"),
                createEmojiButton(`newTicket|🇧🇷PT`, "Português", "SUCCESS", "🇧🇷"),
            ])]
        })

        await interaction.deleteReply();

    }
}

