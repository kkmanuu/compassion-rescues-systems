const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register); // Public registration
router.post('/register-admin', authMiddleware.protect, authMiddleware.restrictTo('admin'), authController.registerAdmin); // Admin-only

module.exports = router;