const statusCode = require('../const/statusCode');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
