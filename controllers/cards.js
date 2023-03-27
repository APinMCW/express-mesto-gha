const Card = require("../models/card");

const getcards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({cards});
  } catch (err) {
    res.status(500).send({ message: "Ошибка по умолчанию." });
  }
};

const delCard = async (req, res, next) => {
  const { id } = req.user._id;
  try {
    const card = await Card.findByIdAndRemove(id);
    res.send({card});
  } catch (err) {
    if (err.name === "Not Found") {
      res
        .status(404)
        .send({ message: `Карточка с указанным ${id} не найдена.` });
    } else {
      res.status(500).send({ message: "Ошибка по умолчанию." });
    }
  }
};

const createcard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(200).send({card});
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({
        message: `Переданы некорректные данные при создании карточки. ${err}`,
      });
    } else {
      res.status(500).send({ message: "Ошибка по умолчанию." });
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    res.send({card});
  } catch (err) {
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
      res.status(500).send({ message: "Ошибка по умолчанию." });
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    res.send({card});
  } catch (err) {
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
      res.status(500).send({ message: "Ошибка по умолчанию." });
    }
  }
};

module.exports = { getcards, delCard, createcard, likeCard, dislikeCard };