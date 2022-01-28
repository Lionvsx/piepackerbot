const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions, MessageActionRow} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const {createEmojiButton} = require("../../functions/messageComponents");

const Guild = require('../../src/schemas/GuildSchema');
require('dotenv').config();

module.exports = class EmbedLanguage extends BaseCommand {
    constructor() {
        super('embed-language', 'config', {
            usage: 'embed-language',
            description: 'Sends language embed',
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
            .setTitle("Please select a language")
            .setDescription("You can select multiple languages. To get the language role, just click the button, clicking the button as you already have the role will remove it from your roles.")
            .setColor("#50e0e0")

        await client.replyLoading(interaction, "Sending embed...")

        let homeGuild = await Guild.findOne({guildId: process.env.HOMEGUILDID})
        let frRoleId = homeGuild?.frRoleId;
        let enRoleId = homeGuild?.enRoleId;
        let esRoleId = homeGuild?.esRoleId;
        let brRoleId = homeGuild?.brRoleId;

        if (!frRoleId || !enRoleId || !esRoleId || !brRoleId) return interaction.editReply({content: `**❌ | **You have to setup the language roles first using \`/setup\``})

        interaction.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([
                createEmojiButton(`buttonRole|${frRoleId}`, "Français", "PRIMARY", "🇫🇷"),
                createEmojiButton(`buttonRole|${enRoleId}`, "English", "PRIMARY", "🇬🇧"),
                createEmojiButton(`buttonRole|${esRoleId}`, "Español", "PRIMARY", "🇪🇸"),
                createEmojiButton(`buttonRole|${brRoleId}`, "Português", "PRIMARY", "🇧🇷"),
            ])]
        })

        await interaction.deleteReply();
    }
}

