
const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  uploadCSV,
  saveRule,
  getRules,
  deleteRule,
  batchSaveTransactions,
  updateTransaction // ✅ this must be present
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTransactions);
router.post('/', protect, createTransaction);
router.delete('/:id', protect, deleteTransaction);
router.post('/upload', protect, uploadCSV);
router.post('/rule', protect, saveRule);
router.get('/rules', protect, getRules);
router.delete('/rule/:id', protect, deleteRule);
router.post('/batch', protect, batchSaveTransactions);
router.put('/:id', protect, updateTransaction);


module.exports = router;
