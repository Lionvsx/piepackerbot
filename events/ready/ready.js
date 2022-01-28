const BaseEvent = require('../../utils/structures/BaseEvent');
const registerGuild = require('../../functions/registerGuild')

const Guild = require('../../src/schemas/GuildSchema')
const { showCommandLoad } = require('../../utils/register')

require('dotenv').config

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready')
    }

    async run(client) {
        client.user.setPresence({
            activities: [{
                name: "Piepacker",
                type: "WATCHING"
            }],
            status: "online"
        })
        client.log(`Bot ${client.user.username} loaded and ready !`)
        await showCommandLoad()

        const commands = client.commandsJSON;

        for (const [key, value] of client.guilds.cache) {
            let guildConfig = await Guild.findOne({ guildId: key });
            if (guildConfig) {
                client.config.set(key, guildConfig)
                client.log(`Loaded config data for guild : ${value.name}`)
            } else {
                client.error(`Guild : ${value.name} wasn't saved in the database, starting register function`)
                await registerGuild(client, value);
            }
        }
        client.log('Started refreshing application (/) commands.');
        for (const [key, value] of client.guilds.cache) {
            const guild = await client.guilds.cache.get(key)
            const guildConfig = client.config.get(key)
            await guild.members.fetch()
            if (guildConfig) {
                client.log(`Cached ${guild.members.cache.size} members data for guild : ${value.name}`)
                if (guildConfig.slashCommands === true) {
                    if (commands.length > 0) {
                        try {
                            await client.application.commands.set(commands, guild.id)
                            client.log(`Loaded ${commands.length} (/) commands for guild ${guild.name}`)
                        } catch (err) {
                            client.error(`Failed setting application commands`, err)
                        }
                    } else await guild.commands.set([])
                    
                } else await guild.commands.set([])
            }
        }
        client.log('Successfully reloaded application (/) commands.');
    }
}