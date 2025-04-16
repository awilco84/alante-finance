// routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBudgets, addBudget, deleteBudget, updateBudget } = require('../controllers/budgetController');

// Budget routes
router.get('/', protect, getBudgets);
router.post('/', protect, addBudget);
router.delete('/:id', protect, deleteBudget);
router.put('/:id', protect, updateBudget); // Only one update route is needed

module.exports = router;
