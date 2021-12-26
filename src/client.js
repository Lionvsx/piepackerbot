const { Client, Intents, Options, Interaction, Message, TextChannel } = require('discord.js');
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
     */
    log(message, logData = undefined) {
        this.consoleLogger.log(message, 'info', logData);
    }
    error(message, logData = undefined) {
        this.consoleLogger.log(message, 'error', logData);
    }
    warning(message, logData = undefined) {
        this.consoleLogger.log(message, 'warn', logData);
    }
    replySuccess(object, content) {
        if (object instanceof Interaction) return object.reply(`**${this.successEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${this.successEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.successEmoji} | **${content}`)
    }

    replyError(object, content) {
        if (object instanceof Interaction) return object.reply(`**${this.errorEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${this.errorEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.errorEmoji} | **${content}`)
    }

    replyWarning(object, content) {
        if (object instanceof Interaction) return object.reply(`**${this.warningEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${this.warningEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${this.warningEmoji} | **${content}`)
    }


    get loadingEmoji() {
        return this.emojis.cache.get('') ?? '🔄️';
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