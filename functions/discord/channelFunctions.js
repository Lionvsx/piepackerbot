const { TextChannel } = require("discord.js");


TextChannel.prototype.sendSuccess = (content) => {
    const sucessEmoji = this.client.emojis.cache.get('') ? this.client.emojis.cache.get('') : '✅'
    return this.send(`**${sucessEmoji} | **${content}`)
}