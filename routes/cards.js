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
router.delete('/:cardId', validateCardId, auth, delCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(url).required(),
  }),
}), auth, createcard);
router.put('/:cardId/likes', validateCardId, auth, likeCard);
router.delete('/:cardId/likes', validateCardId, auth, dislikeCard);

module.exports = router;
