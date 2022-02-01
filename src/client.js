const { Client, Intents, Options, Interaction, Message, TextChannel, DMChannel} = require('discord.js');
require('dotenv').config();
const Logger = require('../utils/services/logger')


class client extends Client {
    constructor(homeGuildId) {
        super({
            intents: [
                Intents.FLAGS.GUILDS, 
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
                Intents.FLAGS.DIRECT_MESSAGES, 
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, 
                Intents.FLAGS.GUILD_MEMBERS, 
                Intents.FLAGS.GUILD_BANS, 
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
                Intents.FLAGS.GUILD_PRESENCES
            ], 
            partials: [
                'MESSAGE', 
                'CHANNEL', 
                'REACTION', 
                'GUILD_MEMBER'
            ], 
            makeCache: Options.cacheWithLimits(Options.defaultMakeCacheSettings)
        })
        this.homeGuildId = homeGuildId
        this.commands = new Map();
        this.interactions = new Map();
        this.config = new Map();
        this.consoleLogger = new Logger('client');
    }

    /**
     *
     * @param message {String}
     * @param logData {JSON}
     * @return {void}
     */
    log(message, logData = undefined) {
        this.consoleLogger.log(message, 'info', logData);
    }

    /**
     *
     * @param message {String}
     * @param logData {JSON}
     * @return {void}
     */
    error(message, logData = undefined) {
        this.consoleLogger.log(message, 'error', logData);
    }
    /**
     *
     * @param message {String}
     * @param logData {JSON}
     * @return {void}
     */
    warning(message, logData = undefined) {
        this.consoleLogger.log(message, 'warn', logData);
    }
    async replySuccess(object, content) {
        if (object instanceof Interaction) return object.reply({content: `**${this.successEmoji} | **${content}`})
        if (object instanceof Message) return object.reply(`**${this.successEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.successEmoji} | **${content}`)
        if (object instanceof DMChannel) return object.send(`**${this.successEmoji} | **${content}`)
    }

    async replyError(object, content) {
        if (object instanceof Interaction) return object.reply({content: `**${this.errorEmoji} | **${content}`, ephemeral: true})
        if (object instanceof Message) return object.reply(`**${this.errorEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.errorEmoji} | **${content}`)
        if (object instanceof DMChannel) return object.send(`**${this.errorEmoji} | **${content}`)
    }

    async replyWarning(object, content) {
        if (object instanceof Interaction) return object.reply({content: `**${this.warningEmoji} | **${content}`, ephemeral: true})
        if (object instanceof Message) return object.reply(`**${this.warningEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.warningEmoji} | **${content}`)
        if (object instanceof DMChannel) return object.send(`**${this.warningEmoji} | **${content}`)
    }

    async replyLoading(object, content) {
        if (object instanceof Interaction) return object.reply({content: `**${this.loadingEmoji} | **${content}`})
        if (object instanceof Message) return object.reply(`**${this.loadingEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.loadingEmoji} | **${content}`)
        if (object instanceof DMChannel) return object.send(`**${this.loadingEmoji} | **${content}`)
    }


    get loadingEmoji() {
        return this.emojis.cache.get('') ?? '🔄';
    }

    get successEmoji() {
        return this.emojis.cache.get('') ?? '✅';
    }

    get errorEmoji() {
        return this.emojis.cache.get('') ?? '❌';
    }

    get warningEmoji() {
        return this.emojis.cache.get('') ?? '⚠️';
    }

    get commandsJSON() {
        const commands = []
        for (const [name, command] of this.commands) {
            commands.push(command.builder.toJSON())
        }
        return commands;
    }


}
const discordClient = new client(process.env.HOMEGUILDID);
module.exports = discordClient;