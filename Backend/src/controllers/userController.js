import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// ─────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Create user (password hashing happens in userModel pre-save hook)
  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ─────────────────────────────────────────────
// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and explicitly include the password field (it has select: false)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Compare entered password with hashed password in DB
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// ─────────────────────────────────────────────
// @desc    Get current logged-in user profile
// @route   GET /api/users/me
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the protect middleware
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export { registerUser, loginUser, getMe };
