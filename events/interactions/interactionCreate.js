const BaseEvent = require('../../utils/structures/BaseEvent')

module.exports = class InteractionCreate extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    async run(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (command.home && interaction.guild.id !== client.homeGuildId) return interaction.reply(
                `This command is only available on the following discord server: \`${client.guilds.get(client.homeGuildId).name}\``
            )
            command.run(client, interaction, interaction.options)
        }
    }
}