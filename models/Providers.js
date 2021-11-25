const { Schema, model } = require('mongoose');

const Provider = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true,
        min: 5
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
});

module.exports = model('Provider', Provider);