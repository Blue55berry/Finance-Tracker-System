const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['Income', 'Expense', 'Borrowing'],
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'transactionType'
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  repayDate: {
    type: Date
  },
  paymentMethod: {
    type: String
  },
  proof: {
    type: String
  }
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
