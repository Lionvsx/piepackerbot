const {MessageButton, MessageActionRow, GuildEmoji, ReactionEmoji} = require("discord.js");
module.exports = {
    createButton,
    createEmojiActionRow,
    createEmojiButton
}

/**
 *
 * @param buttonId {String}
 * @param buttonText {String}
 * @param buttonStyle {"PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK"}
 * @returns {MessageButton}
 */
function createButton(buttonId, buttonText, buttonStyle) {
    return new MessageButton()
        .setCustomId(buttonId)
        .setLabel(buttonText)
        .setStyle(buttonStyle);
}

/**
 *
 * @param buttonId {String}
 * @param buttonText {String}
 * @param buttonStyle {"PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK"}
 * @param emoji {string | GuildEmoji | ReactionEmoji}
 * @returns {MessageButton}
 */
function createEmojiButton(buttonId, buttonText, buttonStyle, emoji) {
    return new MessageButton()
        .setCustomId(buttonId)
        .setLabel(buttonText)
        .setStyle(buttonStyle)
        .setEmoji(emoji);
}

/**
 *
 * @param emojiArray {Emoji[]}
 * @returns {MessageActionRow}
 */
function createEmojiActionRow(emojiArray) {
    const emojiActionRow = new MessageActionRow()
    for (const emoji of emojiArray) {
        emojiActionRow.addComponents(
            createEmojiButton(emoji, '', 'PRIMARY', emoji)
        )
    }
    return emojiActionRow
}

