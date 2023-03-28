/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const statusCode = require('../const/statusCode');

const getcards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(statusCode.OK).send({ cards });
  } catch (err) {
    res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
  }
};

const delCard = async (req, res, next) => {
  const { id } = req.user._id;
  try {
    const card = await Card.findByIdAndRemove(id);
    res.status(statusCode.OK).send({ card });
  } catch (err) {
    if (err.name === null) {
      res
        .status(statusCode.NOT_FOUND)
        .send({ message: `Карточка с указанным ${id} не найдена.` });
    } else {
      res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const createcard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(statusCode.OK).send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные при создании карточки. ${err}`,
      });
    } else {
      res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params.cardId;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
    );
    res.status(statusCode.OK).send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные для постановки лайка. ${err}`,
      });
    }
    if (err.name === null) {
      res
        .status(statusCode.NOT_FOUND)
        .send({ message: `Передан несуществующий ${cardId} карточки.` });
    } else {
      res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params.cardId;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(statusCode.BAD_REQUSET).send({
        message: `Переданы некорректные данные для снятии лайка. ${err}`,
      });
    }
    if (err.name === null) {
      res
        .status(statusCode.NOT_FOUND)
        .send({ message: `Передан несуществующий ${cardId} карточки.` });
    } else {
      res.status(statusCode.SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

module.exports = {
  getcards, delCard, createcard, likeCard, dislikeCard,
};
