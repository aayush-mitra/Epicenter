const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    people: [
        String
    ],
    messages: [
        {
            author: {
                type: String
            },
            date: {
                type: Date
            },
            text: {
                type: String
            }
        }
    ],
});

module.exports = Conversation = mongoose.model("conversations", ConversationSchema);