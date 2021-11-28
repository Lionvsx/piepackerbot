const { Message } = require("discord.js");

/**
 * 
 * @param {String} content 
 * @returns {Message} Edited Message
 */
Message.prototype.editSuccess = (content) => {
    const sucessEmoji = this.client.emojis.cache.get('') ? this.client.emojis.cache.get('') : '✅'
    return this.edit(`**${sucessEmoji} | **${content}`)
}
/**
 * 
 * @param {String} content 
 * @returns {Message} Edited Message
 */
Message.prototype.editError = (content) => {
    const errorEmoji = this.client.emojis.cache.get('') ? this.client.emojis.cache.get('') : '❌'
    return this.edit(`**${errorEmoji} | **${content}`)
}