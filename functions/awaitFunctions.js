const {MessageEmbed, TextChannel, ButtonInteraction} = require("discord.js");
const {createEmojiActionRow} = require("./messageComponents");
const client = require('../src/client')

module.exports = {
    getButtonInteraction,
    getSelectMenuInteraction,
    getUserResponse,
    reactionEmbedSelector,
    reactionEmbedEmojiSelector,
    askForConfirmation,
    selectorReply
}


/**
 *
 * @param channel {TextChannel}
 * @param message {String}
 * @param timeout {Number}
 * @returns {Promise<ButtonInteraction>}
 */
function getButtonInteraction(channel, message, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const filter = interaction => interaction.isButton() === true && interaction.user.bot === false && interaction.message.id === message.id;
        channel.awaitMessageComponent({ filter, time: timeout })
            .then(interaction => resolve(interaction))
            .catch(() => {
                reject(`User Response Timed Out`)
            });
    })
}

function getSelectMenuInteraction(message, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const filter = interaction => interaction.isSelectMenu() === true && interaction.user.bot === false && interaction.message.id === message.id;
        message.awaitMessageComponent({ filter, time: timeout })
            .then(interaction => resolve(interaction))
            .catch(() => {
                message.edit({
                    embeds: [new MessageEmbed().setDescription(`**${client.errorEmoji} Interaction cancelled : \`Timed Out\`**`).setColor('#c0392b')],
                    components: []
                })
                reject(`User Response Timed Out`)
            });
    })
}

async function reactionEmbedEmojiSelector(channel, emojiArray, embed) {
    const sentMessage = await channel.send({
        embeds: [embed],
        components: [createEmojiActionRow(emojiArray)]
    })
    return await getButtonInteraction(channel, sentMessage).catch(() => {
        sentMessage.edit({
            embeds: [new MessageEmbed().setDescription(`**${client.errorEmoji} Interaction cancelled : \`Timed Out\`**`).setColor('#c0392b')],
            components: []
        })
    })
}

async function reactionEmbedSelector(channel, components, embed) {
    const sentMessage = await channel.send({
        embeds: [embed],
        components: components
    })
    return await getButtonInteraction(channel, sentMessage).catch(() => {
        sentMessage.edit({
            embeds: [new MessageEmbed().setDescription(`**${client.errorEmoji} Interaction cancelled : \`Timed Out\`**`).setColor('#c0392b')],
            components: []
        })
    })
}

function askForConfirmation(channel, message) {
    return new Promise(async (resolve, reject) => {
        const interaction = await reactionEmbedEmojiSelector(channel, [client.successEmoji, client.errorEmoji], new MessageEmbed()
            .setTitle('⚠ Please confirm you want to execute this action ⚠')
            .setDescription(message)
            .setColor('#e67e22')).catch(errorMessage => reject(errorMessage))

        if (interaction && interaction.customId === client.successEmoji) {
            interaction.update({
                embeds: [new MessageEmbed().setDescription(`**${client.successEmoji} Confirmed**`).setColor('#2ecc71')],
                components: []
            })
            resolve(true)
        } else if (interaction) {
            interaction.update({
                embeds: [new MessageEmbed().setDescription(`**${client.errorEmoji} Command cancelled**`).setColor('#c0392b')],
                components: []
            })
            resolve(false)
        }
    })
}

/**
 * Prompt a user for a string answer
 * @param channel {TextChannel}
 * @param displayMessage {String}
 * @returns {Promise<String>}
 */
function getUserResponse(channel, displayMessage) {
    return new Promise(async (resolve, reject) => {
        const filter = m => m.author.bot === false
        const sentMsg = await channel.send({
            content: displayMessage
        })
        channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
            .then(collected => {
                resolve(collected.first().content)
            }).catch(() => {
            sentMsg.edit(`**${client.errorEmoji} | **Interaction cancelled : \`Timed Out\``)
            reject('User Response Timed Out')
        })
    })
}

function selectorReply(interaction, emoji, text) {
    const embed = new MessageEmbed()
        .setDescription(`**${emoji} Selected Option : **${text}`)
        .setColor('#2ecc71')
    interaction.update({
        embeds: [embed],
        components: [],
        files: []
    })

}

