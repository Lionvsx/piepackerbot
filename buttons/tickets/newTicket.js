const BaseInteraction = require('../../utils/structures/BaseInteraction')
const {Permissions} = require("discord.js");

module.exports = class ButtonRole extends BaseInteraction {
    constructor() {
        super("newTicket", "tickets", "button",
            {
                userPermissions: [],
                clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_MESSAGES]
            })
    }

    async run(client, interaction, args) {

    }
}