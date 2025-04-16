// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  saved: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Export the model so that Goal.find becomes available
module.exports = mongoose.model('Goal', goalSchema);