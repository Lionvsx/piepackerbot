const {MessageButton, MessageActionRow} = require("discord.js");
module.exports = {
    createButton,
    createEmojiActionRow
}

/**
 *
 * @param buttonId {String}
 * @param buttonText {String}
 * @param buttonStyle {String}
 * @param emoji {Emoji}
 * @returns {MessageButton}
 */
function createButton(buttonId, buttonText, buttonStyle, emoji = undefined) {
    const button = new MessageButton()
        .setCustomId(buttonId)
        .setLabel(buttonText)
        .setStyle(buttonStyle)
    emoji ?? button.setEmoji(emoji)
    
    return button;
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

