const BaseEvent = require('../../utils/structures/BaseEvent');

const Guild = require('../../src/schemas/GuildSchema')
const { showCommandLoad } = require('../../utils/register')

require('dotenv').config

module.exports = class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready')
    }

    async run(client) {
        client.loadingEmoji = client.emojis.cache.get('741276138319380583') ?? '🔄️';
        client.user.setPresence({
            activities: [{
                name: "Test",
                type: "WATCHING"
            }],
            status: "online"
        })
        console.log(`Bot ${client.user.username} loaded and ready !`)
        await showCommandLoad()

        const commands = []
        for (const [name, command] of client.commands) {
            commands.push(command.builder.toJSON())
        }

        for (const [key, value] of client.guilds.cache) {
            const guildConfig = await Guild.findOne({ guildId: key });
            if (guildConfig) {
                client.config.set(key, guildConfig)
                client.log(`Loaded config data for guild : ${value.name}`)
            } else {
                Guild.create({
                    guildId: key,
                    guildName: value.name
                }, async (err) => {
                    if (err) throw err && client.log(`There was an error trying to save GUILD : ${value.name} to the database !`)
                    else client.error(`⚠️ Guild : ${value.name} wasn't saved in the database, created new entry ! ⚠️`)
                })
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