const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super('ping', 'utilities', {
            usage: 'ping',
            description: 'Ping the bot',
            categoryDisplayName: '🔧 Utilities'
        }, {
            clientPermissions: [],
            userPermissions: [],
            home: false
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {
        const loading = client.loadingEmoji;
        const message = await interaction.reply({
            content: `${loading} Pinging server ...`,
            fetchReply: true
        })

        let embed = new MessageEmbed()
            .setColor('#2ecc71')
            .addFields([
                {name: 'Ping', value: `\`${Math.abs(interaction.createdTimestamp - message.createdTimestamp)} ms\``, inline: true},
                {name: 'API Latency', value: `\`${Math.round(client.ws.ping)} ms\``, inline: true}
            ])

        await interaction.editReply({content: ` `, embeds: [embed]})
    }
}

