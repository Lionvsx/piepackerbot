const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed, Permissions, MessageActionRow} = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const Guild = require('../../src/schemas/GuildSchema');
const {createButton} = require("../../functions/messageComponents");
const {getButtonInteraction, selectorReply, getUserResponse} = require("../../functions/awaitFunctions");
require('dotenv').config();

module.exports = class SetupCommand extends BaseCommand {
    constructor() {
        super('setup', 'config', {
            usage: 'setup',
            description: 'Setup utilities for Piepacker Bot functions',
            categoryDisplayName: '⚙️ Config'
        }, {
            clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            home: true
        });

        this.builder = new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName(this.name)
            .setDescription(this.help.description)
    }
    async run(client, interaction, options) {

        //Create Ticket Opening Embed
        //Create Auto Voice channels -> Separate Command
        //Change Bot activity -> Seperate command
        //Setup important channel links
        const dmChannel = await interaction.user.createDM()



        const allChannels = interaction.guild.channels.cache;

        const homeGuild = await Guild.findOne({guildId: process.env.HOMEGUILDID})

        let logChannelString = getChannelStatus(homeGuild?.logChannelId, allChannels);
        let ticketCategoryChannelString = getChannelStatus(homeGuild?.ticketCategoryChannelId, allChannels);
        let ticketRequestChannelString = getChannelStatus(homeGuild?.ticketRequestChannelId, allChannels);
        let frRoleString = getChannelStatus(homeGuild?.frRoleId, allChannels);
        let enRoleString = getChannelStatus(homeGuild?.enRoleId, allChannels);
        let esRoleString = getChannelStatus(homeGuild?.esRoleId, allChannels);
        let brRoleString = getChannelStatus(homeGuild?.brRoleId, allChannels);


        const menuEmbed = new MessageEmbed()
            .setTitle("SETUP MENU FOR SERVER PIEPACKER")
            .setDescription("Setup the different channels and roles required in order for the bot to work properly\nThis menu will time out automatically in 120 seconds")
            .setColor("#5a46b7")
            .addFields([
                {name: "Log Channel", value: `\`\`\`${logChannelString}\`\`\``, inline: true},
                {name: "Ticket Request Channel", value: `\`\`\`${ticketRequestChannelString}\`\`\``, inline: true},
                {name: "Ticket Category Channel", value: `\`\`\`${ticketCategoryChannelString}\`\`\``, inline: true},
                {name: "FR Role", value: `\`\`\`${frRoleString}\`\`\``, inline: true},
                {name: "EN Role", value: `\`\`\`${enRoleString}\`\`\``, inline: true},
                {name: "ES Role", value: `\`\`\`${esRoleString}\`\`\``, inline: true},
                {name: "BR PT Role", value: `\`\`\`${brRoleString}\`\`\``, inline: true}
            ])

        const row1 = new MessageActionRow().addComponents([
            createButton('logChannelId', "Setup Log Channel", "SECONDARY"),
            createButton('ticketRequestChannelId', "Setup Ticket Request Channel", "SECONDARY"),
            createButton('ticketCategoryChannelId', "Setup Ticket Category", "SECONDARY"),
        ])

        const row2 = new MessageActionRow().addComponents([
            createButton('frRoleId', "Setup FR Role", "PRIMARY"),
            createButton('enRoleId', "Setup EN Role", "PRIMARY"),
            createButton('esRoleId', "Setup ES Role", "PRIMARY"),
            createButton('brRoleId', "Setup BR PT Role", "PRIMARY")
        ])

        let message = await dmChannel.send({
            embeds: [menuEmbed],
            components: [row1, row2]
        }).catch(err => {
            this.warn(`Cannot dm user ${interaction.user.tag}`, err)
            client.replyError(interaction, "Please open your direct messages")
        })
        if (!message) return;


        client.replySuccess(interaction, "Opened setup utilities in direct message")

        let buttonInteraction = await getButtonInteraction(dmChannel, message, 120000).catch(errorMessage => {
            message.edit({
                embeds: [new MessageEmbed().setDescription(`**${client.errorEmoji} Interaction cancelled : \`Timed Out\`**`).setColor('#c0392b')],
                components: []
            })
            this.log(`User ${interaction.user.tag} timed out`, errorMessage)
        })

        if (!buttonInteraction) return;
        let label = buttonInteraction.component.label.slice(6);

        selectorReply(buttonInteraction, "🔗", `Option selected : \`${buttonInteraction.component.label}\``)

        switch (buttonInteraction.component.style) {
            case "PRIMARY": {
                let objectId = await getUserResponse(dmChannel, "Please enter a valid role ID :")
                    .catch(() => this.log(`User ${interaction.user.tag} timed out`))
                if (!objectId) return;

                let selectedObject = client.guilds.cache.get(homeGuild.guildId).roles.cache.get(objectId)
                if (!selectedObject) return client.replyError(dmChannel, `I can't find this role on the server \`${client.guilds.cache.get(homeGuild.guildId).name}\``)
                homeGuild[buttonInteraction.customId] = objectId;
                await homeGuild.save();

                client.replySuccess(dmChannel, `Role \`${selectedObject}\` has been set as \`${buttonInteraction.component.label.slice(6)}\``)
                break;
            }
            case "SECONDARY": {
                let objectId = await getUserResponse(dmChannel, "Please enter a valid channel ID :")
                    .catch(() => this.log(`User ${interaction.user.tag} timed out`))
                if (!objectId) return;

                let selectedObject = client.guilds.cache.get(homeGuild.guildId).channels.cache.get(objectId)
                if (!selectedObject) return client.replyError(dmChannel, `I can't find this channel on the server \`${client.guilds.cache.get(homeGuild.guildId).name}\``)
                homeGuild[buttonInteraction.customId] = objectId;
                await homeGuild.save();
                client.replySuccess(dmChannel, `Channel \`${selectedObject.name}\` has been set as \`${label}\``)
                break;
            }
        }
    }
}

const getChannelStatus = (channelId, allChannels) => {
    return channelId ? allChannels.get(channelId)?.name ?? "NOT FOUND > NEED RESET" : "NOT SET";
}

