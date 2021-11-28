const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class CommandsCommand extends BaseCommand {
    constructor() {
        super('commands', 'utilities', {
            usage: 'commands',
            description: `Display all the commands available with the bot`,
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
            .addStringOption(option =>
                option.setName('category')
                    .setDescription("Display commands of a the selected category")
                    .setRequired(false)
            )
    }
    async run(client, interaction, options) {
        const prefix = '/'
        const categoryOption = interaction.options.get('category')
        let array = Array.from(client.commands)
        if (!categoryOption) {
            let categoriesEmbed = new MessageEmbed()
                .setColor('#9b59b6')
                .setAuthor(`${client.user.username}'s commands`, client.user.avatarURL())
                .setDescription(`To view all commands in a category type :
                \`\`\`${prefix}commands <category>\`\`\``)

            let display = array.map(cmd => cmd[1].category)
            let categories = display.filter((x, i) => i === display.indexOf(x))
            categories.forEach(category => {
                let cmd = array.find(cmd => cmd[1].category === category)
                categoriesEmbed.addField(cmd[1].help.categoryDisplayName, `${array.filter(cmd => cmd[1].category === category).length} commands`, true)
            })
            await interaction.reply({
                embeds: [categoriesEmbed]
            })
        } else if (categoryOption) {
            let selectedCategory = array.filter(cmd => cmd[1].category === categoryOption.value.toLowerCase())
            if (selectedCategory.length > 0) {
                let display = []
                let lengthDiv = 23
                selectedCategory.forEach(cmd => {
                    let spareLength = lengthDiv - cmd[1].name.length
                    let spare = Array(spareLength).fill(' ').join('')
                    display.push(`- ${cmd[1].name}${spare}:: ${cmd[1].help.description}`)
                })
                interaction.reply(
                    `\`\`\`yaml\n${display.join('\n')}\`\`\`\n\nTapez \`\`${prefix}help <command>\`\` pour afficher les informations sur une commande spécifique !`
                )

            } else {
                client.replyError(interaction, `Invalid category name, type \`${prefix}commands\` to view all categories`)
            }
        }
    }
}