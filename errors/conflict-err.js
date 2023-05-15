const statusCode = require('../const/statusCode');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.CONFLICT;
  }
}

module.exports = ConflictError;
