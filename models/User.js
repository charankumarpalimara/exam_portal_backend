const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true
  },
  userType: {
    type: String,
    enum: ['Admin', 'Candidate'],
    required: [true, 'Please specify user type']
  },
  username: {
    type: String,
    required: function() {
      return this.userType === 'Admin';
    },
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.userType === 'Admin';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    validate: {
      validator: function(value) {
        // Only validate length if userType is Admin and password is provided
        if (this.userType === 'Admin' && value) {
          return value.length >= 6;
        }
        // For Candidates, password is optional
        return true;
      },
      message: 'Password must be at least 6 characters for Admin users'
    },
    select: false
  },
  hallTicket: {
    type: String,
    required: function() {
      return this.userType === 'Candidate';
    },
    unique: true,
    sparse: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

