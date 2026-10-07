const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit-table');

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

    // Build filter object scoped to logged-in user
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
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end of day for end date
        const eod = new Date(endDate);
        eod.setHours(23, 59, 59, 999);
        filter.date.$lte = eod;
      }
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sort settings
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute paginated query & total count
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    // Calculate aggregated overall financial summary stats for this user
    const allUserTransactions = await Transaction.find({ user: req.user._id });
    
    let totalIncome = 0;
    let totalExpenses = 0;

    allUserTransactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpenses += t.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    res.json({
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
          balance,
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
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
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

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
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

    res.json({ success: true, data: updatedTransaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

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
    const { type, category, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category && category !== 'All') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

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
    const csvData = json2csvParser.parse(transactions);

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
    const { type, category, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category && category !== 'All') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transactions_report_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // PDF Title Header
    doc.fillColor('#1E293B').fontSize(20).text('Financial Transactions Report', { align: 'center' });
    doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()} | User: ${req.user.name}`, { align: 'center' });
    doc.moveDown(1.5);

    // Calculate Totals
    let totalInc = 0;
    let totalExp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalInc += t.amount;
      else totalExp += t.amount;
    });

    // Summary Box
    doc.fontSize(11).fillColor('#0F172A')
      .text(`Total Income: ${req.user.currency || '$'}${totalInc.toFixed(2)}  |  Total Expenses: ${req.user.currency || '$'}${totalExp.toFixed(2)}  |  Net Balance: ${req.user.currency || '$'}${(totalInc - totalExp).toFixed(2)}`)
      .moveDown(1);

    // Construct Table
    const table = {
      title: 'Transaction Details',
      headers: ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method'],
      rows: transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type.toUpperCase(),
        t.title,
        t.category,
        `${req.user.currency || '$'}${t.amount.toFixed(2)}`,
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
