const Result = require('../models/Result');
const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Submit exam
// @route   POST /api/exams/submit
// @access  Private/Candidate
exports.submitExam = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers'
      });
    }

    const candidate = await User.findById(req.user.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get all question IDs from answers
    const questionIds = Object.keys(answers);

    // Fetch questions with correct answers
    const questions = await Question.find({
      _id: { $in: questionIds }
    });

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    const questionsWithResults = [];

    // Calculate score
    questions.forEach(question => {
      const userAnswer = answers[question._id.toString()];
      
      if (userAnswer) {
        attemptedQuestions++;
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }

        questionsWithResults.push({
          questionId: question._id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswer,
          isCorrect: isCorrect
        });
      }
    });

    // Calculate final score (+1 for correct, -1 for wrong, 0 for unattempted)
    const score = correctAnswers - wrongAnswers;
    const totalQuestions = 45;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    // Create result
    const result = await Result.create({
      candidate: candidate._id,
      candidateName: candidate.name,
      hallTicket: candidate.hallTicket,
      answers: answers,
      questions: questionsWithResults,
      totalQuestions: totalQuestions,
      attemptedQuestions: attemptedQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      score: score,
      percentage: parseFloat(percentage),
      timeTaken: timeTaken || 0
    });

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Submit Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting exam'
    });
  }
};

// @desc    Get result by candidate ID
// @route   GET /api/exams/results/me
// @access  Private/Candidate
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ candidate: req.user.id })
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get Results Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all results (Admin only)
// @route   GET /api/exams/results
// @access  Private/Admin
exports.getAllResults = async (req, res) => {
  try {
    const { hallTicket, candidateName } = req.query;
    let query = {};

    if (hallTicket) {
      query.hallTicket = { $regex: hallTicket, $options: 'i' };
    }

    if (candidateName) {
      query.candidateName = { $regex: candidateName, $options: 'i' };
    }

    const results = await Result.find(query)
      .populate('candidate', 'name email hallTicket')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get All Results Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single result by ID
// @route   GET /api/exams/results/:id
// @access  Private
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('candidate', 'name email hallTicket phone');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // If candidate, only allow viewing their own results
    if (req.user.userType === 'Candidate' && result.candidate._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get Result Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete result
// @route   DELETE /api/exams/results/:id
// @access  Private/Admin
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    await result.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete Result Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get exam statistics
// @route   GET /api/exams/statistics
// @access  Private/Admin
exports.getStatistics = async (req, res) => {
  try {
    const totalResults = await Result.countDocuments();
    const totalCandidates = await User.countDocuments({ userType: 'Candidate' });
    const totalQuestions = await Question.countDocuments({ isActive: true });

    const avgScore = await Result.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResults,
        totalCandidates,
        totalQuestions,
        statistics: avgScore[0] || {
          averageScore: 0,
          averagePercentage: 0,
          maxScore: 0,
          minScore: 0
        }
      }
    });
  } catch (error) {
    console.error('Get Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

