const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    guildName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    prefix: {
        type: mongoose.SchemaTypes.String,
        default: '/'
    },
    slashCommands: {
        type: Boolean,
        default: true
    },
    logChannelId: String,
    ticketRequestChannelId: String,
    ticketRequestMessageId: String,
    ticketCategoryChannelId: String,
    frRoleId: String,
    enRoleId: String,
    brRoleId: String,
    esRoleId: String
});

module.exports = mongoose.model('Guild', GuildSchema);