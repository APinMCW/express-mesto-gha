const statusCode = require('../const/statusCode');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
