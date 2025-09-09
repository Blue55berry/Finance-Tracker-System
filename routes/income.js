const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, incomeController.createIncome);
router.get('/', authenticate, incomeController.getAllIncome);
router.get('/summary', authenticate, incomeController.getIncomeSummary);
router.get('/:id', authenticate, incomeController.getIncomeById);
router.put('/:id', authenticate, incomeController.updateIncome);
router.delete('/:id', authenticate, incomeController.deleteIncome);

module.exports = router;