const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { userType, username, password, hallTicket } = req.body;

    // Validate input
    if (!userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user type'
      });
    }

    let user;

    if (userType === 'Admin') {
      // Admin login with username and password
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username and password'
        });
      }

      user = await User.findOne({ username, userType: 'Admin' }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

    } else if (userType === 'Candidate') {
      // Candidate login with hall ticket only
      if (!hallTicket) {
        return res.status(400).json({
          success: false,
          message: 'Please provide hall ticket number'
        });
      }

      user = await User.findOne({ hallTicket, userType: 'Candidate' });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid hall ticket number'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        username: user.username,
        hallTicket: user.hallTicket
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

