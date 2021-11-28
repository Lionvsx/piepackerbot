const BaseCommand = require('../../utils/structures/BaseCommand')
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class HelpCommand extends BaseCommand {
    constructor() {
        super('help', 'utilities', {
            usage: 'help',
            description: 'Display help information about commands',
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
                option.setName('command')
                    .setDescription('Command name to get help information')
                    .setRequired(false)
            )
    }
    async run(client, interaction, options) {
        const prefix = '/'
        const commandOption = options.get('command')
        if (!commandOption) {
            const helpEmbed = new MessageEmbed()
                .setDescription(`**DIRECT COMMAND HELP**\n\`${prefix}help <command>\`\n\n**LIST OF ALL COMMANDS**\n\`${prefix}commands\`\n\n**USEFUL LINKS**\n[Example Website](https://google.com)`)
                .setColor('#1abc9c')
            interaction.reply({
                embeds: [helpEmbed]
            })
        } else if (commandOption) {
            let command = client.commands.get(commandOption.value)
            if (command) {
                let embed = new MessageEmbed()
                    .setTitle(`${command.category.toUpperCase()} | ${command.name.toUpperCase()} COMMAND`)
                    .setDescription(command.help.description)
                    .addField("Usage",`\`${prefix}${command.help.usage}\``)
                    .setColor('#1abc9c')

                let cmdArgs = command.help.arguments
                if (cmdArgs) embed.addField("Arguments", cmdArgs)
                let examples = command.help.examples
                if (examples && examples.length !== 0) {
                    let strExamples = []
                    for (const example of examples) {
                        let exampleArguments = example.split('|')
                        let textExample = `\`${prefix}${exampleArguments[0]}\` - ${exampleArguments[1]}`
                        strExamples.push(textExample)
                    }
                    let exampleText = strExamples.join('\n')
                    embed.addField("Exemples", exampleText)
                }
                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                client.replyError(interaction, "This command doesn't exist !")
            }
        }
    }
}