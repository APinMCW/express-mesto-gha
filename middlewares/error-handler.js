const Code = require('../const/statusCode');

const errorHandler = ((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = Code.SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: Code === Code.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

module.exports = errorHandler;
