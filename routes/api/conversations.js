const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const User = require('../../models/User');
const UserSchema = require('../../models/UserSession');
const Conversation = require('../../models/Conversation');

router.post('/new', (req, res) => {
    const {
        name,
        tag,
        userid
    } = req.body;
    User.findOne({name: name, tag: tag}, (err, peer) => {
        if (err) {
            return res.json({
                success: false
            });
        }
        User.findOne({_id: userid}, (err, user) => {
            const newConversation = new Conversation({
                people: [user.name, peer.name]
            });

            newConversation.save((err, conversation) => {
                peer.conversations.push(conversation._id);
                peer.save()
                user.conversations.push(conversation._id);
                user.save();
                return res.json({
                    success: true,
                    message: conversation
                });
            });
        });
        
    })
    

});

router.get('/conversation', (req, res) => {
    const {
        convoid
    } = req.query;

    Conversation.findOne({_id: convoid}, (err, convo) => {
        return res.json({
            success: true,
            message: convo
        });
    });
})

router.post('/send', (req, res) => {
    const {
        author,
        date,
        text,
        convoid
    } = req.body;

    const msg = {
        author: author,
        date: Date.now(),
        text: text
    };

    Conversation.findOne({_id: convoid}, (err, convo) => {
        convo.messages.push(msg);
        convo.save();
        return res.json({
            success: true
        });
    });
});

module.exports = router;