const Transaction = require('../models/Transaction');
const Rule = require('../models/Rule');
const csv = require('csv-parser');
const stream = require('stream');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('member', 'name')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.user._id });
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...req.body,
        member: req.body.member || null // convert "" to null so Mongoose doesn't crash
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating transaction', error: err.message });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const uploadCSV = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.files.file.data);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const rules = await Rule.find({ user: req.user._id });

        const cleanDescription = (desc) => {
          return desc.toLowerCase().replace(/[^a-z ]/g, '').trim();
        };

        const mapped = results.map((row) => {
          const description = row['Description'] || row['description'] || '';
          const clean = cleanDescription(description);
          const matchedRule = rules.find(r => clean.includes(r.pattern.toLowerCase()));

          return {
            raw: row,
            match: matchedRule ? matchedRule.type : 'Uncategorized',
            patternUsed: matchedRule ? matchedRule.pattern : null
          };
        });

        res.json({ preview: mapped.slice(0, 10), totalRows: mapped.length, fullData: mapped });
      });
  } catch (err) {
    res.status(500).json({ message: 'Error parsing CSV', error: err.message });
  }
};

const batchSaveTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ message: 'Invalid transactions array' });
    }

    const existing = await Transaction.find({ user: req.user._id });
    const deduped = transactions.filter(newTx => {
      return !existing.some(existingTx =>
        existingTx.description === newTx.description &&
        new Date(existingTx.date).toISOString() === new Date(newTx.date).toISOString() &&
        existingTx.amount === Number(newTx.amount)
      );
    });

    const cleaned = deduped.map(tx => {
      const member = tx.member?.trim();
      return {
        user: req.user._id,
        date: new Date(tx.date),
        description: tx.description,
        amount: Number(tx.amount),
        type: tx.type,
        category: tx.category,
        notes: tx.notes || '',
        member: member && member.length === 24 ? member : undefined
      };
    });

    const result = await Transaction.insertMany(cleaned);
    res.status(201).json({ message: `${result.length} transactions saved (after deduplication)`, result });
  } catch (err) {
    res.status(500).json({ message: 'Error saving transactions', error: err.message });
  }
};

const saveRule = async (req, res) => {
  try {
    const { pattern, type } = req.body;
    if (!pattern || !type) {
      return res.status(400).json({ message: 'Pattern and type are required' });
    }

    const rule = new Rule({ user: req.user._id, pattern, type });
    const saved = await rule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving rule', error: err.message });
  }
};

const getRules = async (req, res) => {
  try {
    const rules = await Rule.find({ user: req.user._id });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rules', error: err.message });
  }
};

const deleteRule = async (req, res) => {
  try {
    const deleted = await Rule.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Rule not found' });
    res.json({ message: 'Rule deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting rule', error: err.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  uploadCSV,
  batchSaveTransactions,
  saveRule,
  getRules,
  deleteRule
};