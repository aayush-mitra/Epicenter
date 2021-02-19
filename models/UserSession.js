const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = UserSession = mongoose.model("usersessions", UserSessionSchema);