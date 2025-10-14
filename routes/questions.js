const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getRandomQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Candidate can get random questions for exam
router.get('/random', authorize('Candidate'), getRandomQuestions);

// Admin only routes
router.post('/bulk', authorize('Admin'), bulkCreateQuestions);

router.route('/')
  .get(getQuestions)
  .post(authorize('Admin'), createQuestion);

router.route('/:id')
  .get(authorize('Admin'), getQuestion)
  .put(authorize('Admin'), updateQuestion)
  .delete(authorize('Admin'), deleteQuestion);

module.exports = router;

