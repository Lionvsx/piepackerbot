const {MessageButton, MessageActionRow} = require("discord.js");
module.exports = {
    createButton,
    createEmojiActionRow
}




function createEmojiActionRow(emojiArray) {
    const emojiActionRow = new MessageActionRow()
    for (const emoji of emojiArray) {
        emojiActionRow.addComponents(
            createButton(emoji, '', 'PRIMARY', emoji)
        )
    }
    return emojiActionRow
}

function createButton(buttonId, buttonText, buttonStyle, emoji = undefined) {
    const button = new MessageButton()
        .setCustomId(buttonId)
        .setLabel(buttonText)
        .setStyle(buttonStyle)
    emoji ?? button.setEmoji(emoji)

    return button;
}

