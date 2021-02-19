const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const User = require('../../models/User');
const UserSchema = require('../../models/UserSession');
const UserSession = require('../../models/UserSession');
const Conversation = require('../../models/Conversation');

router.get('/test', (req, res) => {
    res.send('users');
});

router.post('/register', (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    const errors = {};
    User.findOne({email}).then(user => {
        if (user) {
            errors.success = false;
            return res.json(errors);
        } else {
            User.find({name}).then(users => {
                const newUser = new User({
                    email,
                    name,
                    password,
                    tag: users.length
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({
                        success: true,
                        user: user
                        }))
                        .catch(err => console.log(err));
                    });
                });
            })
            
        }
    });
})

router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    let docid;
    User.findOne({email}, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: 'server error'
            });
        }
        if (!user.validPassword(password)) {
            return res.json({
                success: false,
                message: "invalid password"
            });
        }
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'server error'
                });
            }
            console.log(doc._id);
            User.findOne({email}).populate('conversations').exec((err, user1) => {
                console.log(user1);
                return res.json({
                    success: true,
                    message: 'valid',
                    token: doc._id,
                    user: user1
                });
            })
        });
    })

});

router.get('/verify', (req, res) => {
    const {
      token
    } = req.query;
  
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.json({
          success: false,
          message: "Error: Internal Server Error"
        });
      }
  
      if (sessions.length !== 1) {
        return res.json({
          success: false,
          message: 'invalid'
        })
      } else {
        User.findOne({ _id: sessions[0].userId }, (err, user) => {
  
        }).populate('conversations').exec((err, user1) => {
          //console.log(user1);
          return res.json({
            success: true,
            user: user1
          });
        })
  
      }
    });
  })

router.get('/logout', (req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
      $set: { isDeleted: true }
    }, null, (err, sessions) => {
      if (err) {

        return res.json({
          success: false,
          message: "Error: Internal server error"
        });
      }

      return res.json({
        success: true,
        message: "Good"
      });

    });
});


module.exports = router;