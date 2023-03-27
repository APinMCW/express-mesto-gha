const User = require("../models/user");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.find((item) => item._id === id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "Not Found") {
        res
          .status(404)
          .send({ message: `Пользователь по указанному ${id} не найден` });
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при создании пользователя ${err}`,
        });
      } else {
        next(err);
      }
    });
};

const updProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
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
    });
};

const updAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
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
    });
};

module.exports = { getUsers, getUserById, createUser, updProfile, updAvatar };
