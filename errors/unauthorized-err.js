const statusCode = require('../const/statusCode');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
