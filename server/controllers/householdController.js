const HouseholdMember = require('../models/HouseholdMember');

exports.getMembers = async (req, res) => {
  try {
    const members = await HouseholdMember.find({ user: req.user._id });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching members', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const member = new HouseholdMember({ user: req.user._id, name });
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error adding member', error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const deleted = await HouseholdMember.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting member', error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const updated = await HouseholdMember.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating member', error: err.message });
  }
};
