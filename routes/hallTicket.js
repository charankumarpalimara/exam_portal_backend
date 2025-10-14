const express = require('express');
const router = express.Router();
const { generateHallTicket } = require('../utils/generateHallTicket');
const { protect, authorize } = require('../middleware/auth');

// @desc    Generate new hall ticket
// @route   GET /api/hall-ticket/generate
// @access  Private/Admin
router.get('/generate', protect, authorize('Admin'), async (req, res) => {
  try {
    const hallTicket = await generateHallTicket();
    
    res.status(200).json({
      success: true,
      hallTicket: hallTicket,
      format: 'YYYYMDD#### (Year-Month-Day-Sequence)',
      example: '2025J140001 = October 14, 2025, Sequence 0001'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating hall ticket'
    });
  }
});

module.exports = router;

