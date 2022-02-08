const BaseInteraction = require('../../utils/structures/BaseInteraction')
const {Permissions, MessageActionRow, MessageEmbed} = require("discord.js");
const {createSelectionMenu, createButton} = require("../../functions/messageComponents");
const {getUserResponse, getSelectMenuInteraction} = require("../../functions/awaitFunctions");
const Ticket = require('../../src/schemas/TicketSchema');
const Guild = require('../../src/schemas/GuildSchema');

module.exports = class ButtonRole extends BaseInteraction {
    constructor() {
        super("newTicket", "tickets", "button",
            {
                userPermissions: [],
                clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_MESSAGES]
            })
    }

    async run(client, interaction, args) {
        const dmChannel = await interaction.user.createDM()

        const homeGuild = await Guild.findOne({guildId: process.env.HOMEGUILDID})
        if (!homeGuild) {
            await client.replyError("Home guild not found")
            this.error("Home guild not found")
            return;
        }
        let homeDiscordGuild = client.guilds.cache.get(homeGuild.guildId)

        const ticketRequestChannel = homeDiscordGuild.channels.cache.get(homeGuild.ticketRequestChannelId);
        const ticketCategory = homeDiscordGuild.channels.cache.get(homeGuild.ticketCategoryChannelId);

        if (!ticketCategory || !ticketRequestChannel) {
            await client.replyError(interaction, "Setup incomplete for tickets")
            this.error("Ticket category or ticket request channel not found, run /setup to find out")
            return;
        }

        let categoriesSelectMenu = createSelectionMenu('ticketCategories', "Select a category for your request", [
            { value: "Video Conference", label: "Video Conference", description: "Camera system and the masks"},
            { value: "Mobile issues", label: "Mobile issues", description: "Mobile related issues"},
            { value: "Game related issues", label: "Game related issues", description: "Anything happening inside the game itself"},
            { value: "Control issues", label: "Control issues", description: "Mapping/gamehints being wrong, gamepad not being detected"},
            { value: "UI/UX issues", label: "UI/UX issues", description: "Thumbnail not appearing, something shouldn't be where it is etc"},
            { value: "Platform issues", label: "Platform issues", description: "Sign up, switching rooms, catalog etc"}
        ], 1, 1)

        let categoriesMessage = await dmChannel.send({
            embeds: [new MessageEmbed()
                .setDescription("🔽 Please select a category for your request 🔽")
                .setColor("#00b894")],
            components: [new MessageActionRow()
                .addComponents(categoriesSelectMenu)]
        }).catch(err => {
            this.warn(`Cannot dm user ${interaction.user.tag}`, err)
        })

        if (!categoriesMessage) {
            await client.replyError(interaction, "Please open your direct messages")
            return;
        }

        await interaction.deferUpdate();

        const categorySelectMenu = await getSelectMenuInteraction(categoriesMessage)
            .catch(() => this.log(`User ${interaction.user.tag} timed out`))

        if (!categorySelectMenu) return;


        const categoryLabel = categorySelectMenu.values[0]

        await categorySelectMenu.update({
            embeds: [new MessageEmbed()
                .setDescription(`\`\`\`CATEGORY : ${categoryLabel}\`\`\``)
                .setColor("#5cde5f")],
            components: []
        })

        let requestObject = await getUserResponse(dmChannel, `Please express the object of your request below in \`${args[1]}\``)
            .catch(() => this.log(`User ${interaction.user.tag} timed out`))
        if (!requestObject) return;

        let tempMsg = await client.replyLoading(dmChannel, "Creating ticket...")

        const lastTicket = await Ticket.findOne().sort({ _id: -1 }).select('index');
        let ticketIndex = lastTicket ? (lastTicket.index + 1) : 0;
        let ticketName = `ticket-${ticketIndex.toString().padStart(4, '0')}`

        const newTicketChannel = await interaction.guild.channels.create(`📩${ticketName}`, {
            type: 'GUILD_TEXT',
            position: ticketIndex,
            permissionOverwrites: [{ id: interaction.user.id, allow: [Permissions.FLAGS.VIEW_CHANNEL] },  {id: interaction.guild.roles.everyone.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] }],
            parent: ticketCategory
        })

        const accessTicketEmbed = new MessageEmbed()
            .setTitle(`📩 NEW TICKET : \`${newTicketChannel.name}\``)
            .setDescription(`New ticket from \`${interaction.user.tag}\` in ${args[1]}\nTicket request object : \`\`\`${requestObject}\`\`\`\nTicket request category : \`\`\`${categoryLabel}\`\`\``)
            .setTimestamp()
            .setColor('#9b59b6')

        await newTicketChannel.send({
            embeds: [new MessageEmbed()
                .setDescription(`New ticket from \`${interaction.user.tag}\` in ${args[1]}\nTicket request object : \`\`\`${requestObject}\`\`\`\nTicket request category : \`\`\`${categoryLabel}\`\`\``)
                .setColor("#fad285")]
        })

        await ticketRequestChannel.send({
            embeds: [accessTicketEmbed],
            components: [new MessageActionRow()
                .addComponents([
                    createButton(`accessChannel|${newTicketChannel.id}`, "Join Ticket", "SUCCESS")
                ])]
        })

        await Ticket.create({
            ticketChannelId: newTicketChannel.id,
            name: newTicketChannel.name,
            authorId: interaction.user.id,
            index: ticketIndex,
            object: requestObject,
            category: categoryLabel,
            guildId: interaction.guild.id,
        })

        tempMsg.edit(`**${client.successEmoji} | **Ticket opened with success, please check channel \`${newTicketChannel.name}\` on discord \`${interaction.guild.name}\``)
    }
}