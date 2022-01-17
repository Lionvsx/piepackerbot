const BaseInteraction = require('../../utils/structures/BaseInteraction')
const {Permissions} = require("discord.js");

module.exports = class ButtonMultipleRoles extends BaseInteraction {
    constructor() {
        super("buttonMultipleRoles", "button-roles", "button",
            {
                userPermissions: [],
                clientPermissions: [Permissions.FLAGS.MANAGE_ROLES]
            })
    }

    async run(client, interaction, args) {
        args.shift();
        try {
            interaction.member.roles.add(args)
        } catch (error) {
            this.error(`An error occured while adding roles to user : ${interaction.user.tag}`, error)
        }
    }
}