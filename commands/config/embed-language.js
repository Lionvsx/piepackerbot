const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions, MessageActionRow} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {createEmojiButton} = require("../../functions/messageComponents");

module.exports = class EmbedLanguage extends BaseCommand {
    constructor() {
        super('embed-language', 'config', {
            usage: 'embed-language',
            description: 'Sends language embed',
            categoryDisplayName: '⚙️ Config'
        }, {
            clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            home: false
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {
        const embed = new MessageEmbed()
            .setTitle("Please select a language")
            .setDescription("You can select multiple languages. To get the language role, just click the button, clicking the button as you already have the role will remove it from your roles.")
            .setColor("#50e0e0")

        await client.replyLoading(interaction, "Sending embed...")

        interaction.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([
                createEmojiButton(`buttonRole|935524858924773416`, "Français", "PRIMARY", "🇫🇷"),
                createEmojiButton(`buttonRole|935524818269401108`, "English", "PRIMARY", "🇬🇧"),
                createEmojiButton(`buttonRole|935524882245115914`, "Español", "PRIMARY", "🇪🇸"),
                createEmojiButton(`buttonRole|935524921554108426`, "Português", "PRIMARY", "🇧🇷"),
            ])]
        })

        await interaction.deleteReply();
    }
}

