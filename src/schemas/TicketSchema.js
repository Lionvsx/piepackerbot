const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticketChannelId: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    authorId: String,
    index: Number,
    object: String,
    category: String,
    guildId: {
        type: String,
        required: true
    },
    claimedByUserId: String,
    archive: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Ticket', TicketSchema);