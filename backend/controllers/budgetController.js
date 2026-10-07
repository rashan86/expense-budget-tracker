const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get monthly budget limits and progress/actual spending
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    // Find all budgets set by user for this month & year
    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    // Determine start and end date of the requested month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch all expense transactions for the user in this month
    const monthlyExpenses = await Transaction.find({
      user: req.user._id,
      type: 'expense',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Map spending per category
    const categorySpendingMap = {};
    monthlyExpenses.forEach((tx) => {
      categorySpendingMap[tx.category] = (categorySpendingMap[tx.category] || 0) + tx.amount;
    });

    // Combine budget limits with actual spent
    const budgetsWithProgress = budgets.map((b) => {
      const spent = categorySpendingMap[b.category] || 0;
      const percentage = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
      let status = 'ok';
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 80) {
        status = 'warning';
      }

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

    res.json({
      success: true,
      data: {
        month,
        year,
        budgets: budgetsWithProgress,
        totalBudgeted: budgets.reduce((acc, curr) => acc + curr.monthlyLimit, 0),
        totalSpent: Object.values(categorySpendingMap).reduce((acc, curr) => acc + curr, 0),
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

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category budget limit
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

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
