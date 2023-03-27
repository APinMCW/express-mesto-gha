const User = require("../models/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.find((item) => item._id === id);
    res.send(user);
  } catch (err) {
    if (err.name === "Not Found") {
      res
        .status(404)
        .send({ message: `Пользователь по указанному ${id} не найден` });
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: `Переданы некорректные данные при создании пользователя ${err}`,
      });
    } else {
      next(err);
    }
  }
};

const updProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name, about: about },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: `Переданы некорректные данные при обновлении профиля. ${err}`,
      });
    }
    if (err.name === "Not Found") {
      res
        .status(404)
        .send({ message: `Пользователь по указанному ${id} не найден` });
    } else {
      next(err);
    }
  }
};

const updAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatar });
    res.status(200).send(user.avatar);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: `Переданы некорректные данные при обновлении аватара. ${err}`,
      });
    }
    if (err.name === "Not Found") {
      res
        .status(404)
        .send({ message: `Пользователь по указанному ${id} не найден` });
    } else {
      next(err);
    }
  }
};

module.exports = { getUsers, getUserById, createUser, updProfile, updAvatar };
