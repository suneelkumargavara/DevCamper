const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../mideleware/async');
const User = require('../models/User');

// @desc Register a user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    role,
    password,
  });

  // Create token
  const token = user.getSignedJWTToken();

  res.status(200).json({
    success: true,
    token,
  });
});

// @desc Login User
// @route /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter valid email or password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Create token
  const token = user.getSignedJWTToken();

  res.status(200).json({
    success: true,
    token,
  });
});
