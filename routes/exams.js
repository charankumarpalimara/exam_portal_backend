const express = require('express');
const router = express.Router();
const {
  submitExam,
  getMyResults,
  getAllResults,
  getResultById,
  deleteResult,
  updateResult,
  getStatistics
} = require('../controllers/examController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Candidate routes
router.post('/submit', authorize('Candidate'), submitExam);
router.get('/results/me', authorize('Candidate'), getMyResults);

// Admin routes
router.get('/results', authorize('Admin'), getAllResults);
router.get('/statistics', authorize('Admin'), getStatistics);

// Shared routes
router.route('/results/:id')
  .get(getResultById)
  .put(authorize('Admin'), updateResult)
  .delete(authorize('Admin'), deleteResult);

module.exports = router;

