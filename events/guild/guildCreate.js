const BaseEvent = require('../../utils/structures/BaseEvent')
const registerGuild = require('../../functions/registerGuild')


module.exports = class guildCreateEvent extends BaseEvent {
    constructor() {
        super('guildCreate')
    }

    async run(client, guild) {
        client.log(`Bot ${client.user.username} joined GUILD : ${guild.name} !`)
        registerGuild(client, guild);
    }
}