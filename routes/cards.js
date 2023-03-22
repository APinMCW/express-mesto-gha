const router = require('express').Router();
const { getcards, delCard, createcard } = require('../controllers/cards');

router.get('/', getcards);
router.delete('/:userId', delCard);
router.post('/', createcard);
router.put('/:cardsId/likes', );
router.delete('/:cardsId/likes', )

module.exports = router;
