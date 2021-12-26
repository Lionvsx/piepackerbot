const Guild = require('../src/schemas/GuildSchema')

module.exports = async (client, guild) => {
    let guildConfig = await Guild.create({
        guildId: guild.id,
        guildName: guild.name
    }).catch(async (err) => {
        return client.error(`There was an error trying to save GUILD : ${guild.name} to the database !`, err)
    })
    client.log(`${guild.name} saved to DB`)

    client.config.set(guild.id, guildConfig)

    await guild.members.fetch()
    client.log(`Cached ${guild.members.cache.size} members data for guild : ${guild.name}`)
    const commands = client.commandsJSON;

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