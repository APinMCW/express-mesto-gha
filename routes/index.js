const router = require('express').Router();
const statusCode = require('../const/statusCode');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/cards', cardRoutes);
router.use('/users', userRoutes);
router.use((req, res) => {
  res.status(statusCode.NOT_FOUND).send({ message: 'Страница не найдена.' });
});

module.exports = router;
