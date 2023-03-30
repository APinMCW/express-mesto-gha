/* eslint-disable no-unused-vars */
const User = require('../models/user');
const statusCode = require('../const/statusCode');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(statusCode.OK).send({ users });
  } catch (err) {
    res
      .status(statusCode.SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию.' });
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user === null) {
      res.status(statusCode.NOT_FOUND).send({ message: `Пользователь по указанному ${id} не найден` });
    }
    res.status(statusCode.OK).send({ user });
  } catch (err) {
    if (id.length !== 24) {
      res
        .status(statusCode.BAD_REQUSET)
        .send({ message: 'Указан некорректный id' });
    } else {
      res
        .status(statusCode.SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(statusCode.OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные при создании пользователя ${err}`,
      });
    } else {
      res
        .status(statusCode.SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const updProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { runValidators: true, new: true },
    );
    res.status(statusCode.OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные при обновлении профиля. ${err}`,
      });
    }
    if (err.name === null) {
      res
        .status(statusCode.NOT_FOUND)
        .send({ message: `Пользователь по указанному ${id} не найден` });
    } else {
      res
        .status(statusCode.SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const updAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(id, { avatar });
    res.status(statusCode.OK).send({ avatar });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные при обновлении аватара. ${err}`,
      });
    }
    if (err.name === null) {
      res
        .status(statusCode.NOT_FOUND)
        .send({ message: `Пользователь по указанному ${id} не найден` });
    } else {
      res
        .status(statusCode.SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updProfile,
  updAvatar,
};
