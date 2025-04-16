
const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pattern: String,
  type: String
}, { timestamps: true });

module.exports = mongoose.model('Rule', RuleSchema);
