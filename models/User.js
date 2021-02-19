const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String
    },
    tag: {
        type: Number
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'conversations'
        }
    ]
});

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User = mongoose.model("users", UserSchema);