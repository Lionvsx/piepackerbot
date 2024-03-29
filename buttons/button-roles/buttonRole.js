const BaseInteraction = require('../../utils/structures/BaseInteraction')
const {Permissions} = require("discord.js");

module.exports = class ButtonRole extends BaseInteraction {
    constructor() {
        super("buttonRole", "button-roles", "button",
            {
                userPermissions: [],
                clientPermissions: [Permissions.FLAGS.MANAGE_ROLES]
            })
    }

    async run(client, interaction, args) {
        let selectedRole = interaction.guild.roles.cache.get(args[1])
        if (!selectedRole) {
            this.error(`Can't find role with role ID : ${args[1]}`)
            await client.replyWarning(interaction, `This role doesn't exist anymore`)
            return
        }
        if (interaction.member.roles.cache.has(selectedRole.id)) {
            try {
                await interaction.member.roles.remove(selectedRole)
                interaction.reply({
                    content: `**${client.successEmoji} | **Removed role <@&${selectedRole.id}> from your roles`,
                    ephemeral: true
                })
            } catch (error) {
                this.error(`An error has occurred while removing role : ${selectedRole.name} from user : ${interaction.user.tag}`, error)
            }
        } else {
            try {
                await interaction.member.roles.add(selectedRole)
                interaction.reply({
                    content: `**${client.successEmoji} | **Added role <@&${selectedRole.id}> to your roles`,
                    ephemeral: true
                })
            } catch (error) {
                this.error(`An error has occurred while adding role : ${selectedRole.name} to user : ${interaction.user.tag}`, error)
            }
        }
    }
}