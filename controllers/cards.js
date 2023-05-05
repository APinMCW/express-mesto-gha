/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const statusCode = require('../const/statusCode');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

// GET /cards/
const getcards = (req, res, next) => {
  Card.find({}).then((cards) => {
    res.status(statusCode.OK).send({ cards });
  }).catch(next);
};

// DELETE /cards/:cardId
const delCard = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;
  let owner;
  Card.findById(cardId)
    .then((card) => {
      owner = card.owner._id;
      if (owner === null) {
        throw new BadRequestError('Вы не можете удалить эту карточку');
      }
    })
    .catch(next);
  if (user === owner) {
    Card.findByIdAndRemove(cardId)
      .then((card) => {
        if (card === null) {
          throw new NotFoundError(`Карточка с указанным id:${cardId} не найдена.`);
        }
        res.status(statusCode.OK).send({ card });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
        } else {
          next(err);
        }
      });
  }
};

// POST /cards/
const createcard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(statusCode.OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(`Переданы некорректные данные при создании карточки. ${err}`);
      } else {
        next(err);
      }
    });
};

// PUT /cards/:cardId/likes
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайка. ');
      }
      res.status(statusCode.OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId/likes
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Переданы некорректные данные для снятии лайка.');
      }
      res.status(statusCode.OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getcards, delCard, createcard, likeCard, dislikeCard,
};
