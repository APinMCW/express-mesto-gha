const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: [2, 'Must be at least 6, got {VALUE}'],
    maxLength: [30, 'Should be no more than 30, got {VALUE}'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: [2, 'Must be at least 6, got {VALUE}'],
    maxLength: [30, 'Should be no more than 30, got {VALUE}'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Invalid link',
    },
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Invalid email',
    },
    required: [true, 'email is required'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'password is required'],
  },
});

module.exports = mongoose.model('user', userSchema);
