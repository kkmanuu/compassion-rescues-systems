const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createCase, getPendingCases, approveCase, rejectCase, sendAdminMessage } = require('../controllers/caseController');

// Routes
router.post('/cases', protect, createCase);
router.get('/cases/pending', protect, adminOnly, getPendingCases);
router.patch('/cases/:caseId/approve', protect, adminOnly, approveCase);
router.patch('/cases/:caseId/reject', protect, adminOnly, rejectCase);
router.post('/messages/admin', protect, adminOnly, sendAdminMessage);

module.exports = router;
