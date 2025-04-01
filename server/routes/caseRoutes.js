const express = require('express');
const router = express.Router();
const { createCase, getAllCases, getCaseDetails, updateCaseStatus, deleteCase, approveCase } = require('../controllers/caseController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.protect);

router.post('/', createCase);
router.get('/', getAllCases);
router.get('/:caseId', getCaseDetails);
router.delete('/:caseId', authMiddleware.restrictTo('admin'), deleteCase);
router.put('/:caseId/status', authMiddleware.restrictTo('admin'), updateCaseStatus);
router.put('/:id/approve', authMiddleware.protect, authMiddleware.restrictTo('admin'), approveCase);


module.exports = router;
