const { errors } = require('celebrate');
const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use(errors());

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = router;
