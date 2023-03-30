const router = require('express').Router();
const {
  getcards,
  delCard,
  createcard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getcards);
router.delete('/:cardId', delCard);
router.post('/', createcard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
