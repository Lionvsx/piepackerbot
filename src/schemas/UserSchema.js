const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    onServer: {
        type: Boolean,
        required: true
    }
})

module.exports = UserSchema;