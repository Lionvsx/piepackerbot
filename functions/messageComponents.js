const {MessageButton, MessageActionRow} = require("discord.js");
module.exports = {
    createButton,
    createEmojiActionRow,
    createEmojiButton
}

/**
 *
 * @param buttonId {String}
 * @param buttonText {String}
 * @param buttonStyle {String}
 * @returns {MessageButton}
 */
function createButton(buttonId, buttonText, buttonStyle) {
    return new MessageButton()
        .setCustomId(buttonId)
        .setLabel(buttonText)
        .setStyle(buttonStyle);
}

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
            createButton(emoji, '', 'PRIMARY', emoji)
        )
    }
    return emojiActionRow
}

