const statusCode = require('../const/statusCode');

class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.METHOD_NOT_ALLOWED;
  }
}

module.exports = MethodNotAllowedError;
