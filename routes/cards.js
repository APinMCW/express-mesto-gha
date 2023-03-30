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
router.put('/:cardsId/likes', likeCard);
router.delete('/:cardsId/likes', dislikeCard);

module.exports = router;
