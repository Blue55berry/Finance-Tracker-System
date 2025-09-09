const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const { authenticate } = require('../middleware/auth');

module.exports = function(upload) {
  router.post('/', authenticate, upload, borrowingController.createBorrowing);
  router.get('/', authenticate, borrowingController.getAllBorrowings);
  router.get('/:id', authenticate, borrowingController.getBorrowingById);
  router.put('/:id', authenticate, borrowingController.updateBorrowing);
  router.patch('/:id/repay', authenticate, borrowingController.markAsRepaid);
  router.delete('/:id', authenticate, borrowingController.deleteBorrowing);

  return router;
};