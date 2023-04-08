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

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { Code = statusCode.SERVER_ERROR, message } = err;

  res
    .status(Code)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: Code === statusCode.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

module.exports = router;
