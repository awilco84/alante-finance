const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);

module.exports = router;
