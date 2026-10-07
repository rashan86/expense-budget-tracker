const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for the budget'],
      trim: true,
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Please set a monthly budget limit'],
      min: [0, 'Limit must be non-negative'],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budget entry for same user, category, month, and year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
