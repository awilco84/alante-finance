const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['needs', 'wants', 'savings', 'investments'],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
// Compare this snippet from client/src/pages/Transactions.js:
// import React, { useState, useEffect } from 'react';