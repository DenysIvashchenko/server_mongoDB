const { Schema, model } = require('mongoose');

const User = new Schema({
    username: { type: String, unique: true, required: true, trim: true, },
    password: { type: String, required: true, min: 5 },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = model('User', User)