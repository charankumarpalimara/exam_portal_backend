const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Please provide options'],
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: String,
    required: [true, 'Please provide the correct answer'],
    validate: {
      validator: function(answer) {
        return this.options.includes(answer);
      },
      message: 'Correct answer must be one of the options'
    }
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['General', 'Technical', 'Aptitude', 'Logical'],
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
questionSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Question', questionSchema);

