const express = require('express');
const router = express.Router();
const { getReceipts, getReceipt } = require('../controllers/receiptController');
const { authenticate } = require('../middleware/auth');

router.route('/').get(authenticate, getReceipts);
router.route('/:id').get(authenticate, getReceipt);

module.exports = router;
