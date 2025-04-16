const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching goals', error: err.message });
  }
};

const addGoal = async (req, res) => {
  try {
    const { name, target } = req.body;
    const goal = new Goal({ user: req.user._id, name, target });
    const saved = await goal.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error adding goal', error: err.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting goal', error: err.message });
  }
};

const getTotalSavings = async (req, res) => {
  try {
    const savings = await Transaction.find({ user: req.user._id, type: 'savings' });
    const total = savings.reduce((sum, tx) => sum + Number(tx.amount), 0);

    const goals = await Goal.find({ user: req.user._id });
    const allocated = goals.reduce((sum, goal) => sum + (goal.saved || 0), 0);
    const unallocated = total - allocated;

    res.json({ total, unallocated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate savings total', error: err.message });
  }
};

const allocateToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.saved = (goal.saved || 0) + Number(amount);
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Error allocating to goal', error: err.message });
  }
};

module.exports = {
  getGoals,
  addGoal,
  deleteGoal,
  getTotalSavings,
  allocateToGoal
};
