const Card = require("../models/card");

const getcards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const delCard = (req, res, next) => {
  const { id } = req.user._id;
  Card.findByIdAndRemove(id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "Not Found") {
        res
          .status(404)
          .send({ message: `Карточка с указанным ${id} не найдена.` });
      } else {
        next(err);
      }
    });
};

const createcard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при создании карточки. ${err}`,
        });
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные для постановки лайка. ${err}`,
        });
      }
      if (err.name === "Not Found") {
        res
          .status(404)
          .send({ message: `Передан несуществующий ${id} карточки.` });
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndRemove(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные для снятии лайка. ${err}`,
        });
      }
      if (err.name === "Not Found") {
        res
          .status(404)
          .send({ message: `Передан несуществующий ${id} карточки.` });
      } else {
        next(err);
      }
    });
};

module.exports = { getcards, delCard, createcard, likeCard, dislikeCard };
