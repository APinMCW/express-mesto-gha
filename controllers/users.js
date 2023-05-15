/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const statusCode = require('../const/statusCode');
const { JWT_SECRET } = require('../config');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

function findAndUpdate(req, res, next, id, update) {
  User.findByIdAndUpdate(
    id,
    { update },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      res.status(statusCode.OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля. ${err}`));
      }
    });
}

function findUser(req, res, next, id) {
  User.findById(id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      res.status(statusCode.OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('Указан некорректный id'));
      }
    });
}
// GET /users/
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(statusCode.OK).send({ users }))
    .catch(next);
};

// GET /users/:id
const getUserById = (req, res, next) => {
  const { id } = req.params;

  findUser(req, res, next, id);
};

// POST /users/signup
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  }))
    .then((user) => user.set('password', undefined))
    .then((user) => res.status(statusCode.OK).send({ user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
      }
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Переданы некорректные данные при создании пользователя ${err}`));
      }
    });
};

// PATCH /users/me
const updProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.payload._id;

  findAndUpdate(req, res, next, id, { name, about });
};

// PATCH /users/me/avatar
const updAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.payload._id;

  findAndUpdate(req, res, next, id, { avatar });
};
// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, 'password')
    .orFail(() => { throw new UnauthorizedError('Пользователь не найден'); })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      throw new UnauthorizedError('Пользователь не найден');
      // eslint-disable-next-line no-shadow
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(statusCode.OK).send({ _id: user._id, jwt });
    })
    .catch(next);
};

// GET /users/me
const getUserInfo = (req, res, next) => {
  const { authorization } = req.headers;

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Пользователь не найден');
  }

  findUser(req, res, next, payload._id);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updProfile,
  updAvatar,
  login,
  getUserInfo,
};
