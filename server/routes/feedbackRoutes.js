const express = require('express');
const { submitFeedback, getAllFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, restrictTo('user'), submitFeedback); // Only users can submit
router.get('/', protect, restrictTo('admin'), getAllFeedback); // Only admin can view
router.post('/update', protect, restrictTo('admin'), updateFeedbackStatus); // Only admin can update

module.exports = router;
