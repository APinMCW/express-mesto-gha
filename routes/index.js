const { errors } = require('celebrate');
const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');

router.use('/', authRoutes);
router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use(errors());

router.use((next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = router;
