// server/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const {
  getGoals,
  addGoal,
  deleteGoal,
  getTotalSavings,
  allocateToGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGoals);
router.post('/', protect, addGoal);
router.delete('/:id', protect, deleteGoal);
router.get('/savings-total', protect, getTotalSavings);
router.post('/:id/allocate', protect, allocateToGoal); // ✅ this must be defined in controller

module.exports = router;