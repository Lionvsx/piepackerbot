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
        this.loadingEmoji = undefined;
    }

    /**
     *
     * @param message {String}
     * @param logData {JSON}
     */
    log(message, logData = undefined) {
        logData ? this.consoleLogger.log(message, 'info') : this.consoleLogger.log(message, 'info', logData);
    }
    error(message, logData = undefined) {
        logData ? this.consoleLogger.log(message, 'error') : this.consoleLogger.log(message, 'error', logData);
    }
    warning(message, logData = undefined) {
        logData ? this.consoleLogger.log(message, 'warn') : this.consoleLogger.log(message, 'warn', logData);
    }
    replySuccess(object, content) {
        const successEmoji = this.emojis.cache.get('') ?? '✅';
        if (object instanceof Interaction) return object.reply(`**${successEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${successEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${successEmoji} | **${content}`)
    }

    replyError(object, content) {
        const errorEmoji = this.emojis.cache.get('') ?? '❌';
        if (object instanceof Interaction) return object.reply(`**${errorEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${errorEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${errorEmoji} | **${content}`)
    }

    replyWarning(object, content) {
        const warningEmoji = this.emojis.cache.get('') ?? '⚠';
        if (object instanceof Interaction) return object.reply(`**${warningEmoji} | **${content}`)
        if (object instanceof Message) return object.reply(`**${warningEmoji} | **${content}`)
        if (object instanceof TextChannel) return object.send(`**${warningEmoji} | **${content}`)
    }


}
const discordClient = new client(process.env.HOMEGUILDID);
module.exports = discordClient;