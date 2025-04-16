const express = require('express');
const router = express.Router();
const { getMembers, addMember, deleteMember, updateMember } = require('../controllers/householdController');
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');


router.get('/', protect, getMembers);
router.post('/', protect, addMember);
router.delete('/:id', protect, deleteMember);
router.put('/:id', protect, updateMember);

module.exports = router;
