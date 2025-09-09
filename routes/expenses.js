const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, expenseController.createExpense);
router.get('/', authenticate, expenseController.getAllExpenses);
router.get('/summary', authenticate, expenseController.getExpenseSummary);
router.get('/categories', authenticate, expenseController.getExpensesByCategory);
router.get('/weekly', authenticate, expenseController.getWeeklySummary);
router.get('/byDay', authenticate, expenseController.getExpensesByDay);
router.get('/:id', authenticate, expenseController.getExpenseById);
router.put('/:id', authenticate, expenseController.updateExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);

module.exports = router;