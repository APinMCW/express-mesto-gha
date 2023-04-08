const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getcards,
  delCard,
  createcard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

router.get('/', getcards);
router.delete('/:cardId', validateCardId, delCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }),
}), createcard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
