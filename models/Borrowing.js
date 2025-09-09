const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  from: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date },
  isRepaid: { type: Boolean, default: false },
  repaidDate: { type: Date },
  paymentMethod: { type: String },
  proof: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Borrowing || mongoose.model('Borrowing', borrowingSchema);
