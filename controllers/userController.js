const User = require('../models/User');
const { generateHallTicket } = require('../utils/generateHallTicket');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { userType, search } = req.query;
    let query = {};

    if (userType) {
      query.userType = userType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { hallTicket: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, userType, username, password, hallTicket } = req.body;

    // Check if user already exists
    if (userType === 'Admin' && username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    // Auto-generate hall ticket for candidates if not provided
    let finalHallTicket = hallTicket;
    
    if (userType === 'Candidate') {
      if (!hallTicket) {
        // Auto-generate hall ticket
        finalHallTicket = await generateHallTicket();
      } else {
        // Check if provided hall ticket already exists
        const existingUser = await User.findOne({ hallTicket });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Hall ticket already exists'
          });
        }
      }
    }

    // Create user data
    const userData = {
      ...req.body,
      ...(userType === 'Candidate' && { hallTicket: finalHallTicket })
    };

    // Remove password field for Candidates if it's empty
    if (userType === 'Candidate' && (!userData.password || userData.password === '')) {
      delete userData.password;
    }

    const user = await User.create(userData);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: user,
      message: userType === 'Candidate' && !hallTicket 
        ? `User created with auto-generated hall ticket: ${finalHallTicket}` 
        : 'User created successfully'
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow password update through this route
    delete req.body.password;

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

