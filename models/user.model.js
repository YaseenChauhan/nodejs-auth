const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'superadmin']
    },
    accessToken: {
        type: String
    }
})

const User = mongoose.model("user", userSchema);
module.exports = User;