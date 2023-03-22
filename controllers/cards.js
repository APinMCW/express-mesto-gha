const Card = require("../models/card");

module.exports.getcards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createcard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
  .then((card) => res.status(200).send(card))
  .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};