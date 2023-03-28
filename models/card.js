const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [2, 'Must be at least 6, got {VALUE}'],
    maxLength: [30, 'Should be no more than 30, got {VALUE}'],
  },
  link: {
    type: String,
    required: [true, 'link is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
