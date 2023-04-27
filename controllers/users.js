/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const statusCode = require('../const/statusCode');
const { JWT_SECRET } = require('../config');
const { BadRequestError } = require('../errors/bad-request-err');
const { NotFoundError } = require('../errors/not-found-err');
const { UnauthorizedError } = require('../errors/unauthorized-err');

// GET /users/
const getUsers = (req, res, next) => {
  User.find({}).tnen((users) => res.status(statusCode.OK).send({ users }))
    .catch(next);
};

// GET /users/:id
const getUserById = (req, res, next) => {
  const { id } = req.params;
  try {
    User.findById(id).then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      res.status(statusCode.OK).send({ user });
    });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Указан некорректный id');
    } else {
      next(err);
    }
  }
};

// POST /users/signup
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    bcrypt.hash(password, 10).then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })).then((user) => user.set('password', undefined))
      .then((user) => res.status(statusCode.OK)
        .send({ user }))
      .catch((err) => {
        if (err.code === 11000) {
          res
            .status(statusCode.CONFLICT)
            .send({ message: 'Пользователь с такими данными уже существует' });
        }
        next(err);
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError(`Переданы некорректные данные при создании пользователя ${err}`);
    } else {
      next(err);
    }
  }
};

// PATCH /users/me
const updProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  try {
    User.findByIdAndUpdate(
      id,
      { name, about },
      { runValidators: true, new: true },
    ).then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      res.status(statusCode.OK).send({ user });
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError(`Переданы некорректные данные при обновлении профиля. ${err}`);
    } else {
      next(err);
    }
  }
};

// PATCH /users/me/avatar
const updAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  try {
    User.findByIdAndUpdate(id, { avatar }).then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      res.status(statusCode.OK).send({ avatar });
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError(`Переданы некорректные данные при обновлении аватара. ${err}`);
    } else {
      next(err);
    }
  }
};
// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  try {
    User.findOne({ email }).select('+password')
      .orFail(new NotFoundError('Пользователь не найден'))
      .tnen((user) => bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          return res.status(statusCode.OK).send({ user });
        }
        throw new UnauthorizedError('Пользователь не найден');
      // eslint-disable-next-line no-shadow
      }))
      .then((user) => {
        const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.status(statusCode.OK).send({ user, jwt });
      })
      .catch(next);
  } catch (err) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Указан некорректный email');
    } else {
      next(err);
    }
  }
};

// GET /users/me
const getUserInfo = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Пользователь не найден');
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Пользователь не найден');
  }

  User
    .findById(payload._id)
    .orFail(() => new UnauthorizedError('Пользователь не найден'))
    .then((user) => res.status(statusCode.OK).send(user))
    .catch(next);
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
