const ErrorResponse = require('../utils/ErrorResponse');

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack);

  // Dev logging
  console.log(JSON.parse(JSON.stringify(err)));

  // Bad object id
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 400);
  }

  // Duplicate keys
  if (err.code == -11000) {
    const message = 'Duplicate field values entered';
    error = new ErrorResponse(message, 400);
  }

  // Invalid field value
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  // JSON Web Token Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized to access this resource';
    error = new ErrorResponse(message, 401);
  }

  // JSON Web Token Expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expires, please sign in again';
    error = new ErrorResponse(message, 401);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Internal server error' });
}

module.exports = errorHandler;
