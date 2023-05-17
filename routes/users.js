const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updProfile,
  updAvatar,
  getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { url } = require('../const/regex');

router.get('/', auth, getUsers);
router.get('/me', auth, getUserInfo);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), auth, updProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(url),
  }),
}), auth, updAvatar);

module.exports = router;
