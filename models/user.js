const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [2, 'Must be at least 6, got {VALUE}'],
    maxLength: [30, 'Should be no more than 30, got {VALUE}'],
  },
  about: {
    type: String,
    required: [true, 'about is required'],
    minLength: [2, 'Must be at least 6, got {VALUE}'],
    maxLength: [30, 'Should be no more than 30, got {VALUE}'],
  },
  avatar: {
    type: String,
    required: [true, 'avatar is required'],
  },
});

module.exports = mongoose.model('user', userSchema);
