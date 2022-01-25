const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions, MessageActionRow} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {createButton} = require("../../functions/messageComponents");

module.exports = class EmbedLanguage extends BaseCommand {
    constructor() {
        super('embed-language', 'config', {
            usage: 'embed-language',
            description: '',
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
            .setTitle("")
            .setDescription("")

        await interaction.deferUpdate();

        interaction.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([
                createButton(`accessChannel|`, "FR", "PRIMARY", "🇫🇷"),
                createButton(`accessChannel|`, "ENG", "PRIMARY", "🇬🇧")
            ])]
        })
    }
}

