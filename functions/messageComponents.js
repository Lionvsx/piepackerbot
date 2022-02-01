const {MessageButton, MessageActionRow, GuildEmoji, ReactionEmoji, MessageSelectMenu} = require("discord.js");
module.exports = {
    createButton,
    createEmojiActionRow,
    createEmojiButton,
    createSelectionMenu,
    createSelectionMenuOption,
    getMenuOption,
    setDefaultOption
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

/**
 *
 * @param {String} menuId
 * @param {String} placeholderText
 * @param {Object[]} menuOptionArray
 * @param {Number} minSelections
 * @param {Number} maxSelections
 * @returns {MessageSelectMenu}
 */
function createSelectionMenu(menuId, placeholderText, menuOptionArray, minSelections, maxSelections) {
    return new MessageSelectMenu()
        .setCustomId(menuId)
        .setPlaceholder(placeholderText)
        .addOptions(menuOptionArray)
        .setMinValues(minSelections)
        .setMaxValues(maxSelections)
}

function createSelectionMenuOption(optionId, displayText, optDescription, optEmoji, optIsDefaultOption) {
    return {
        label: displayText,
        value: optionId,
        description: optDescription ?  optDescription : undefined,
        emoji: optEmoji ? optEmoji : undefined,
        default: optIsDefaultOption ? optIsDefaultOption : undefined
    }
}

function getMenuOption(menuComponent, optionValue) {
    const selectedOption = menuComponent.options.find(option => option.value === optionValue)
    const optionIndex = menuComponent.options.indexOf(selectedOption)

    return menuComponent.options[optionIndex]
}

function setDefaultOption(menuComponent, optionValue) {
    const selectedOption = menuComponent.options.find(option => option.value === optionValue)
    const optionIndex = menuComponent.options.indexOf(selectedOption)

    for (const option of menuComponent.options) {
        option.default = false;
    }
    menuComponent.options[optionIndex].default = true;
}
