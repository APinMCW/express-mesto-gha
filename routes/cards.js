const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getcards,
  delCard,
  createcard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { url } = require('../const/regex');

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

router.get('/', auth, getcards);
router.delete('/:cardId', validateCardId, delCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(url),
  }),
}), createcard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
