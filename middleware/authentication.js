const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect routes from users not signed in
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this resource', 401)
    );
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Set the correct user in the req object
  req.user = await User.findById(decoded.id);

  next();
});

// Grant access to users with specific routes
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with role '${req.user.role}' not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};

// Check if user is not admin, then ensure they are resource owner
exports.checkOwnership = (model) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
      const reqId = req.params.id || req.params.programId;

      const resource = await model.findById(reqId);

      if (!resource) {
        return next(
          new ErrorResponse(`Resource not found with id ${reqId}`, 404)
        );
      }

      if (resource.user.toString() !== req.user.id) {
        return next(
          new ErrorResponse(
            `User ${req.user.id} not authorized to modify resource ${reqId}`,
            403
          )
        );
      }
    }

    next();
  });
