// controllers/budgetController.js
const Budget = require('../models/Budget');

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets', error: err.message });
  }
};

// Add a new budget
exports.addBudget = async (req, res) => {
  try {
    const { category, amount, type } = req.body;
    // Changed from 'limit: amount' to 'amount'
    const budget = new Budget({ user: req.user._id, category, amount, type });
    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error adding budget', error: err.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget', error: err.message });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { category, amount, type } = req.body;
    // Update object now uses 'amount' instead of 'limit'
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { category, amount, type },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Budget not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating budget', error: err.message });
  }
};