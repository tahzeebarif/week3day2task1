const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
    });
  }
};

/**
 * @desc    Login user & return JWT
 * @route   POST /api/users/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

/**
 * @desc    Get current authenticated user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

module.exports = { register, login, getMe };
