const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit-table');

// Fallback in-memory dataset
let fallbackTransactions = [
  {
    _id: 'tx_1',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'income',
    title: 'Monthly Software Engineer Salary',
    amount: 4500.0,
    category: 'Salary',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    paymentMethod: 'Bank Transfer',
    notes: 'Tech Corp monthly salary deposit',
  },
  {
    _id: 'tx_2',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'income',
    title: 'Freelance Web Design Project',
    amount: 850.0,
    category: 'Freelance',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    paymentMethod: 'Bank Transfer',
    notes: 'Completed client landing page redesign',
  },
  {
    _id: 'tx_3',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Monthly Apartment Rent',
    amount: 1400.0,
    category: 'Housing & Rent',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
    paymentMethod: 'Bank Transfer',
    notes: 'Downtown apartment rental payment',
  },
  {
    _id: 'tx_4',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Whole Foods Grocery Shopping',
    amount: 320.5,
    category: 'Food & Dining',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 4),
    paymentMethod: 'Credit Card',
    notes: 'Weekly fresh groceries',
  },
  {
    _id: 'tx_5',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Electricity & High-speed Fiber Bill',
    amount: 185.0,
    category: 'Utilities & Bills',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 6),
    paymentMethod: 'Debit Card',
    notes: 'Monthly utility bill',
  },
  {
    _id: 'tx_6',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Weekend Dining & Coffee with Friends',
    amount: 145.0,
    category: 'Food & Dining',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 7),
    paymentMethod: 'Credit Card',
    notes: 'Italian restaurant dinner',
  },
  {
    _id: 'tx_7',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Netflix & Spotify Premium Subscriptions',
    amount: 24.99,
    category: 'Entertainment',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8),
    paymentMethod: 'Credit Card',
    notes: 'Monthly digital subscriptions',
  },
  {
    _id: 'tx_8',
    user: '660f0a1b2c3d4e5f6a7b8c9d',
    type: 'expense',
    title: 'Gas Station Refill',
    amount: 65.0,
    category: 'Transportation',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 9),
    paymentMethod: 'Credit Card',
    notes: 'Full tank fuel',
  },
];

// @desc    Get user transactions with search, filter, pagination, and overall summary stats
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = { user: req.user._id };

      if (type && ['income', 'expense'].includes(type.toLowerCase())) {
        filter.type = type.toLowerCase();
      }

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) {
          const eod = new Date(endDate);
          eod.setHours(23, 59, 59, 999);
          filter.date.$lte = eod;
        }
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [transactions, totalCount] = await Promise.all([
        Transaction.find(filter).sort(sort).skip(skip).limit(limitNum),
        Transaction.countDocuments(filter),
      ]);

      const allUserTransactions = await Transaction.find({ user: req.user._id });
      
      let totalIncome = 0;
      let totalExpenses = 0;

      allUserTransactions.forEach((t) => {
        if (t.type === 'income') totalIncome += t.amount;
        else if (t.type === 'expense') totalExpenses += t.amount;
      });

      return res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            total: totalCount,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(totalCount / limitNum) || 1,
          },
          summary: {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
          },
        },
      });
    }

    // Fallback mode logic
    let filtered = [...fallbackTransactions];

    if (type && type !== 'All') {
      filtered = filtered.filter((t) => t.type.toLowerCase() === type.toLowerCase());
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
      );
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    fallbackTransactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpenses += t.amount;
    });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      data: {
        transactions: paginated,
        pagination: {
          total: filtered.length,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(filtered.length / limitNum) || 1,
        },
        summary: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.json({ success: true, data: transaction });
    }

    const tx = fallbackTransactions.find((t) => t._id === req.params.id);
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: tx });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res, next) => {
  try {
    const { type, title, amount, category, date, paymentMethod, notes } = req.body;

    if (!type || !title || amount === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, amount, and category',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const transaction = await Transaction.create({
        user: req.user._id,
        type,
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : new Date(),
        paymentMethod: paymentMethod || 'Cash',
        notes: notes || '',
      });

      return res.status(201).json({ success: true, data: transaction });
    }

    const newTx = {
      _id: 'tx_' + Date.now(),
      user: req.user._id,
      type,
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Cash',
      notes: notes || '',
    };
    fallbackTransactions.unshift(newTx);
    res.status(201).json({ success: true, data: newTx });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      const { type, title, amount, category, date, paymentMethod, notes } = req.body;

      if (type) transaction.type = type;
      if (title) transaction.title = title;
      if (amount !== undefined) transaction.amount = Number(amount);
      if (category) transaction.category = category;
      if (date) transaction.date = new Date(date);
      if (paymentMethod) transaction.paymentMethod = paymentMethod;
      if (notes !== undefined) transaction.notes = notes;

      const updatedTransaction = await transaction.save();
      return res.json({ success: true, data: updatedTransaction });
    }

    const index = fallbackTransactions.findIndex((t) => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

    fallbackTransactions[index] = {
      ...fallbackTransactions[index],
      ...req.body,
      amount: req.body.amount !== undefined ? Number(req.body.amount) : fallbackTransactions[index].amount,
    };
    res.json({ success: true, data: fallbackTransactions[index] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const transaction = await Transaction.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.json({ success: true, message: 'Transaction deleted successfully' });
    }

    fallbackTransactions = fallbackTransactions.filter((t) => t._id !== req.params.id);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to CSV file
// @route   GET /api/transactions/export/csv
// @access  Private
const exportCSV = async (req, res, next) => {
  try {
    let txs = fallbackTransactions;

    if (mongoose.connection.readyState === 1) {
      const { type, category, startDate, endDate } = req.query;
      const filter = { user: req.user._id };

      if (type) filter.type = type;
      if (category && category !== 'All') filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      txs = await Transaction.find(filter).sort({ date: -1 });
    }

    const fields = [
      { label: 'Date', value: (row) => new Date(row.date).toLocaleDateString() },
      { label: 'Type', value: 'type' },
      { label: 'Title', value: 'title' },
      { label: 'Category', value: 'category' },
      { label: 'Amount', value: 'amount' },
      { label: 'Payment Method', value: 'paymentMethod' },
      { label: 'Notes', value: 'notes' },
    ];

    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(txs);

    res.header('Content-Type', 'text/csv');
    res.attachment(`transactions_report_${Date.now()}.csv`);
    return res.send(csvData);
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to PDF file
// @route   GET /api/transactions/export/pdf
// @access  Private
const exportPDF = async (req, res, next) => {
  try {
    let txs = fallbackTransactions;

    if (mongoose.connection.readyState === 1) {
      const { type, category, startDate, endDate } = req.query;
      const filter = { user: req.user._id };

      if (type) filter.type = type;
      if (category && category !== 'All') filter.category = category;
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      txs = await Transaction.find(filter).sort({ date: -1 });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transactions_report_${Date.now()}.pdf`
    );

    doc.pipe(res);

    doc.fillColor('#1E293B').fontSize(20).text('Financial Transactions Report', { align: 'center' });
    doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()} | User: ${req.user.name || 'John Doe'}`, { align: 'center' });
    doc.moveDown(1.5);

    let totalInc = 0;
    let totalExp = 0;
    txs.forEach((t) => {
      if (t.type === 'income') totalInc += t.amount;
      else totalExp += t.amount;
    });

    doc.fontSize(11).fillColor('#0F172A')
      .text(`Total Income: ${req.user.currency || '$'}${totalInc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  |  Total Expenses: ${req.user.currency || '$'}${totalExp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  |  Net Balance: ${req.user.currency || '$'}${(totalInc - totalExp).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      .moveDown(1);

    const table = {
      title: 'Transaction Details',
      headers: ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method'],
      rows: txs.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type.toUpperCase(),
        t.title,
        t.category,
        `${req.user.currency || '$'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        t.paymentMethod || 'Cash',
      ]),
    };

    doc.table(table, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10).fillColor('#1E293B'),
      prepareRow: (row, indexColumn, indexRow, rect, rowOptions) => {
        doc.font('Helvetica').fontSize(9).fillColor('#334155');
      },
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
  exportPDF,
};
