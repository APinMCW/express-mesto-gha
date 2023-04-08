const statusCode = require('../const/statusCode');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.NOT_FOUND;
  }
}

module.exports = NotFoundError;
