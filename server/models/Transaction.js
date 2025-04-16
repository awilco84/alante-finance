const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: Date,
  description: String,
  amount: Number,
  type: String,
  category: String,
  notes: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HouseholdMember',
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
