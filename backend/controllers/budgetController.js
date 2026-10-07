const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

let fallbackBudgets = [
  {
    _id: 'b_1',
    category: 'Food & Dining',
    monthlyLimit: 600.0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
  {
    _id: 'b_2',
    category: 'Housing & Rent',
    monthlyLimit: 1500.0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
  {
    _id: 'b_3',
    category: 'Utilities & Bills',
    monthlyLimit: 200.0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
  {
    _id: 'b_4',
    category: 'Entertainment',
    monthlyLimit: 150.0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
  {
    _id: 'b_5',
    category: 'Transportation',
    monthlyLimit: 200.0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
];

// @desc    Get monthly budget limits and progress/actual spending
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    if (mongoose.connection.readyState === 1) {
      const budgets = await Budget.find({
        user: req.user._id,
        month,
        year,
      });

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const monthlyExpenses = await Transaction.find({
        user: req.user._id,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const categorySpendingMap = {};
      monthlyExpenses.forEach((tx) => {
        categorySpendingMap[tx.category] = (categorySpendingMap[tx.category] || 0) + tx.amount;
      });

      const budgetsWithProgress = budgets.map((b) => {
        const spent = categorySpendingMap[b.category] || 0;
        const percentage = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
        let status = 'ok';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 80) status = 'warning';

        return {
          _id: b._id,
          category: b.category,
          monthlyLimit: b.monthlyLimit,
          spent: Number(spent.toFixed(2)),
          remaining: Number(Math.max(0, b.monthlyLimit - spent).toFixed(2)),
          percentage: Number(percentage.toFixed(1)),
          status,
          month: b.month,
          year: b.year,
        };
      });

      return res.json({
        success: true,
        data: {
          month,
          year,
          budgets: budgetsWithProgress,
          totalBudgeted: budgets.reduce((acc, curr) => acc + curr.monthlyLimit, 0),
          totalSpent: Object.values(categorySpendingMap).reduce((acc, curr) => acc + curr, 0),
        },
      });
    }

    // Fallback calculation mode
    const budgetsWithProgress = fallbackBudgets.map((b) => {
      const spent = b.category === 'Food & Dining' ? 465.5 : b.category === 'Housing & Rent' ? 1400.0 : b.category === 'Utilities & Bills' ? 185.0 : b.category === 'Entertainment' ? 24.99 : 65.0;
      const percentage = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
      let status = 'ok';
      if (percentage >= 100) status = 'exceeded';
      else if (percentage >= 80) status = 'warning';

      return {
        _id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent: Number(spent.toFixed(2)),
        remaining: Number(Math.max(0, b.monthlyLimit - spent).toFixed(2)),
        percentage: Number(percentage.toFixed(1)),
        status,
        month,
        year,
      };
    });

    return res.json({
      success: true,
      data: {
        month,
        year,
        budgets: budgetsWithProgress,
        totalBudgeted: fallbackBudgets.reduce((acc, curr) => acc + curr.monthlyLimit, 0),
        totalSpent: budgetsWithProgress.reduce((acc, curr) => acc + curr.spent, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update category budget limit
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;

    if (!category || monthlyLimit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category and monthly limit',
      });
    }

    const now = new Date();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();

    if (mongoose.connection.readyState === 1) {
      const budget = await Budget.findOneAndUpdate(
        {
          user: req.user._id,
          category: category.trim(),
          month: targetMonth,
          year: targetYear,
        },
        {
          monthlyLimit: Number(monthlyLimit),
        },
        { new: true, upsert: true, runValidators: true }
      );

      return res.status(200).json({ success: true, data: budget });
    }

    const existingIndex = fallbackBudgets.findIndex((b) => b.category === category);
    if (existingIndex !== -1) {
      fallbackBudgets[existingIndex].monthlyLimit = Number(monthlyLimit);
    } else {
      fallbackBudgets.push({
        _id: 'b_' + Date.now(),
        category,
        monthlyLimit: Number(monthlyLimit),
        month: targetMonth,
        year: targetYear,
      });
    }

    res.status(200).json({ success: true, data: { category, monthlyLimit } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category budget limit
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const budget = await Budget.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!budget) {
        return res.status(404).json({ success: false, message: 'Budget not found' });
      }

      return res.json({ success: true, message: 'Budget limit removed successfully' });
    }

    fallbackBudgets = fallbackBudgets.filter((b) => b._id !== req.params.id);
    res.json({ success: true, message: 'Budget limit removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  setBudget,
  deleteBudget,
};
