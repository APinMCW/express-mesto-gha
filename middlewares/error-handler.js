const statusCode = require('../const/statusCode');

const errorHandler = ((err, req, res, next) => {
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
  next();
});

module.exports = errorHandler;
