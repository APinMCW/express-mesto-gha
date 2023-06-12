/* eslint-disable no-unused-vars */
const Error = require('mongoose');
const Card = require('../models/card');
const statusCode = require('../const/statusCode');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

function updateDataCard(req, res, next, cardId, data) {
  Card.findByIdAndUpdate(
    cardId,
    data,
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайка. ');
      }
      res.status(statusCode.OK).send(card);
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
      } else {
        next(err);
      }
    });
}

// GET /cards/
const getcards = (req, res, next) => {
  Card.find({}).then((cards) => {
    res.status(statusCode.OK).send(cards);
  }).catch(next);
};

// DELETE /cards/:cardId
const delCard = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Карточка с указанным id:${cardId} не найдена.`);
      }
      const owner = card.owner.toString();
      if (user === owner) {
        Card.findByIdAndRemove(cardId)
          .then((copy) => {
            if (copy === null) {
              throw new NotFoundError(`Карточка с указанным id:${cardId} не найдена.`);
            }
            res.status(statusCode.OK).send(copy);
          })
          .catch((err) => {
            if (err instanceof Error.CastError) {
              throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
            } else {
              next(err);
            }
          });
      } else {
        throw new ForbiddenError('Нет прав доступа');
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        throw new BadRequestError(`Передан несуществующий id:${cardId} карточки.`);
      } else {
        next(err);
      }
    });
};

// POST /cards/
const createcard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(statusCode.CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        throw new BadRequestError(`Переданы некорректные данные при создании карточки. ${err}`);
      } else {
        next(err);
      }
    });
};

// PUT /cards/:cardId/likes
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  updateDataCard(req, res, next, cardId, { $addToSet: { likes: req.user._id } });
};

// DELETE /cards/:cardId/likes
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  updateDataCard(req, res, next, cardId, { $pull: { likes: req.user._id } });
};

module.exports = {
  getcards, delCard, createcard, likeCard, dislikeCard,
};
