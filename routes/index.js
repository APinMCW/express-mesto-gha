const { errors } = require('celebrate');
const router = require('express').Router();
const statusCode = require('../const/statusCode');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const authRoutes = require('./auth');

router.use('/', authRoutes);
router.use('/cards', cardRoutes);
router.use('/users', userRoutes);

router.use(errors());

router.use((req, res) => {
  res.status(statusCode.NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

module.exports = router;
