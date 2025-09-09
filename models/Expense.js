const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Food',
        'Transport',
        'Housing',
        'Entertainment',
        'Utilities',
        'Healthcare',
        'Other',
      ],
    },
    description: { type: String },
    date: { type: Date, default: Date.now },
    isRegular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
