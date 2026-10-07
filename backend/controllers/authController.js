const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt_secret_fallback_key_12345', {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      currency: currency || '$',
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          currency: user.currency,
          token,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Check for user (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          currency: user.currency,
          token,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile / preferences
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.currency = req.body.currency || user.currency;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const token = generateToken(updatedUser._id);

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          currency: updatedUser.currency,
          token,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
