const Question = require('../models/Question');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    const { category, difficulty, isActive } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get random questions for exam (45 questions)
// @route   GET /api/questions/random
// @access  Private/Candidate
exports.getRandomQuestions = async (req, res) => {
  try {
    const totalQuestions = 45;

    // Get active questions and shuffle them
    const questions = await Question.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: totalQuestions } }
    ]);

    if (questions.length < totalQuestions) {
      return res.status(400).json({
        success: false,
        message: `Not enough active questions. Required: ${totalQuestions}, Available: ${questions.length}`
      });
    }

    // Remove correct answer from response for candidates
    const questionsForExam = questions.map(q => ({
      id: q._id,
      question: q.question,
      options: q.options,
      category: q.category
    }));

    res.status(200).json({
      success: true,
      count: questionsForExam.length,
      data: questionsForExam
    });
  } catch (error) {
    console.error('Get Random Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private/Admin
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = async (req, res) => {
  try {
    // Add creator to question
    req.body.createdBy = req.user.id;

    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Create Question Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating question'
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating question'
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private/Admin
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of questions'
      });
    }

    // Add creator to all questions
    const questionsWithCreator = questions.map(q => ({
      ...q,
      createdBy: req.user.id
    }));

    const createdQuestions = await Question.insertMany(questionsWithCreator);

    res.status(201).json({
      success: true,
      count: createdQuestions.length,
      data: createdQuestions
    });
  } catch (error) {
    console.error('Bulk Create Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating questions'
    });
  }
};

