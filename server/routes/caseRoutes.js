const express = require('express');
const { createCase, getAllCases, getCaseDetails, updateCaseStatus } = require('../controllers/caseController');
const authMiddleware = require('../middleware/auth'); // Ensure correct path

const router = express.Router();

// Public routes (accessible by everyone)
router.get('/', getAllCases);
router.get('/:caseId', getCaseDetails);


// Admin-restricted routes
router.post('/', authMiddleware.protect, createCase);
router.put('/:caseId/status', authMiddleware.protect, updateCaseStatus);

module.exports = router;
