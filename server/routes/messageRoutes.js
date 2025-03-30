const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Get all messages for a specific case
router.get('/case/:caseId', messageController.getCaseMessages);

// Send a new message
router.post('/', messageController.sendMessage);

module.exports = router;
