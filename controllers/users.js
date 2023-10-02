const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc        Get all users
// @route       GET /api/v1/users
// @access      Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get user
// @route       GET /api/v1/users/:id
// @access      Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 400)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc        Create user
// @route       POST /api/v1/users
// @access      Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc        Update user
// @route       PUT /api/v1/users/:id
// @access      Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  // Check if updating password
  const { password, ...updateFields } = req.body;

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 400)
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  // Hash password if changed
  if (password) {
    user.password = password;
    await user.save();
  }

  res.status(200).json({ success: true, data: user });
});

// @desc        Delete user
// @route       DELETE /api/v1/users/:id
// @access      Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`));
  }

  await user.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
