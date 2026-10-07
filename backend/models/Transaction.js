const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required (income or expense)'],
    },
    title: {
      type: String,
      required: [true, 'Please add a transaction title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add a valid amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
      default: 'Cash',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
transactionSchema.index({ title: 'text', category: 'text', notes: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);
