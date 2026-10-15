require('./config/dnsFix');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

async function seedDemoData() {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
    await mongoose.connect(connStr, { serverSelectionTimeoutMS: 15000 });
    console.log('[Seed] Connected to MongoDB Atlas successfully.');

    // 1. Find or create demo user 'Rashan'
    let user = await User.findOne({ email: 'john@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Rashan',
        email: 'john@example.com',
        password: 'password123',
        currency: '$',
      });
      console.log('[Seed] Created User: Rashan (john@example.com)');
    } else {
      user.name = 'Rashan';
      await user.save();
      console.log('[Seed] Updated existing user name to Rashan.');
    }

    // 2. Clear old test transactions and budgets for this user
    await Transaction.deleteMany({ user: user._id });
    await Budget.deleteMany({ user: user._id });
    console.log('[Seed] Cleared previous records for clean demo dataset.');

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth(); // 0-indexed (e.g. 9 for Oct)

    // Helper to generate dates relative to current month
    const curDate = (day) => new Date(curYear, curMonth, day, 12, 0, 0);
    const lastMonthDate = (day) => new Date(curYear, curMonth - 1, day, 12, 0, 0);
    const twoMonthsAgoDate = (day) => new Date(curYear, curMonth - 2, day, 12, 0, 0);

    // 3. Rich, realistic Transactions (Last 3 Months)
    const transactions = [
      // ================== CURRENT MONTH: INCOME ==================
      {
        user: user._id,
        type: 'income',
        title: 'Senior Software Engineer Salary',
        amount: 4850.0,
        category: 'Salary',
        date: curDate(1),
        paymentMethod: 'Bank Transfer',
        notes: 'Monthly corporate tech payroll direct deposit',
      },
      {
        user: user._id,
        type: 'income',
        title: 'Freelance React & Fintech Web App',
        amount: 1250.0,
        category: 'Freelance',
        date: curDate(5),
        paymentMethod: 'Bank Transfer',
        notes: 'Milestone 2 frontend dashboard delivery',
      },
      {
        user: user._id,
        type: 'income',
        title: 'S&P 500 Portfolio Stock Dividends',
        amount: 340.0,
        category: 'Investments',
        date: curDate(10),
        paymentMethod: 'Bank Transfer',
        notes: 'Quarterly dividend reinvestment cash distribution',
      },

      // ================== CURRENT MONTH: EXPENSES ==================
      {
        user: user._id,
        type: 'expense',
        title: 'Luxury Apartment Rent (Current Month)',
        amount: 1450.0,
        category: 'Housing & Rent',
        date: curDate(2),
        paymentMethod: 'Bank Transfer',
        notes: 'Downtown residential apartment lease payment',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Whole Foods Market Fresh Groceries',
        amount: 285.5,
        category: 'Food & Dining',
        date: curDate(3),
        paymentMethod: 'Credit Card',
        notes: 'Weekly organic produce, dairy, and fruits',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Electricity & Municipal Water Utility',
        amount: 145.0,
        category: 'Utilities & Bills',
        date: curDate(4),
        paymentMethod: 'Debit Card',
        notes: 'Monthly residential power and water statement',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Italian Fine Dining & Wine with Friends',
        amount: 135.0,
        category: 'Food & Dining',
        date: curDate(6),
        paymentMethod: 'Credit Card',
        notes: 'Dinner celebration at Bellagio Ristorante',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Gigabit Fiber High-Speed Internet',
        amount: 89.99,
        category: 'Utilities & Bills',
        date: curDate(7),
        paymentMethod: 'Credit Card',
        notes: 'Monthly fiber optical workspace internet connection',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Shell Gas Station Premium Fuel',
        amount: 75.0,
        category: 'Transportation',
        date: curDate(8),
        paymentMethod: 'Credit Card',
        notes: 'Full tank premium octane refill',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Netflix 4K Ultra HD Subscription',
        amount: 22.99,
        category: 'Entertainment',
        date: curDate(9),
        paymentMethod: 'Credit Card',
        notes: 'Monthly digital video streaming service',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Spotify Family Music Premium',
        amount: 16.99,
        category: 'Entertainment',
        date: curDate(9),
        paymentMethod: 'Credit Card',
        notes: 'Monthly hi-fi music streaming plan',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'AWS Cloud Infrastructure & Hosting',
        amount: 68.5,
        category: 'Entertainment',
        date: curDate(10),
        paymentMethod: 'Credit Card',
        notes: 'Monthly compute instances and database storage',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Equinox Wellness & Gym Membership',
        amount: 65.0,
        category: 'Healthcare',
        date: curDate(11),
        paymentMethod: 'Credit Card',
        notes: 'Monthly health club and fitness access',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Artisan Espresso Beans & Coffee Bar',
        amount: 48.5,
        category: 'Food & Dining',
        date: curDate(12),
        paymentMethod: 'Credit Card',
        notes: 'Roasted espresso beans for home brewing',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Annual Comprehensive Medical Checkup',
        amount: 110.0,
        category: 'Healthcare',
        date: curDate(12),
        paymentMethod: 'Debit Card',
        notes: 'Routine health screening and vitamins',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Uber City Commute & Airport Rides',
        amount: 42.5,
        category: 'Transportation',
        date: curDate(13),
        paymentMethod: 'Credit Card',
        notes: 'Direct transit to airport terminal',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Apple 4K Studio Display Cable & Hub',
        amount: 185.0,
        category: 'Shopping',
        date: curDate(13),
        paymentMethod: 'Credit Card',
        notes: 'Ergonomic workstation hardware upgrade',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'System Architecture & Cloud Course',
        amount: 39.99,
        category: 'Education',
        date: curDate(14),
        paymentMethod: 'Credit Card',
        notes: 'Advanced distributed systems masterclass',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Weekend Boutique Beach Resort Stay',
        amount: 240.0,
        category: 'Travel',
        date: curDate(14),
        paymentMethod: 'Credit Card',
        notes: 'Weekend relaxation coastal getaway',
      },

      // ================== PREVIOUS MONTH (M-1): CASHFLOW DATA ==================
      {
        user: user._id,
        type: 'income',
        title: 'Senior Software Engineer Salary (Last Month)',
        amount: 4850.0,
        category: 'Salary',
        date: lastMonthDate(1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'income',
        title: 'Consulting Advisory Retainer',
        amount: 850.0,
        category: 'Freelance',
        date: lastMonthDate(8),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Apartment Rent (Last Month)',
        amount: 1450.0,
        category: 'Housing & Rent',
        date: lastMonthDate(2),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Supermarket Groceries & Household Essentials',
        amount: 480.0,
        category: 'Food & Dining',
        date: lastMonthDate(5),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Utilities & Fiber Internet',
        amount: 230.0,
        category: 'Utilities & Bills',
        date: lastMonthDate(6),
        paymentMethod: 'Debit Card',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Digital Streaming & Cloud Subscriptions',
        amount: 108.48,
        category: 'Entertainment',
        date: lastMonthDate(9),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Vehicle Maintenance & Fuel Refills',
        amount: 185.0,
        category: 'Transportation',
        date: lastMonthDate(15),
        paymentMethod: 'Credit Card',
      },

      // ================== TWO MONTHS AGO (M-2): CASHFLOW DATA ==================
      {
        user: user._id,
        type: 'income',
        title: 'Senior Software Engineer Salary',
        amount: 4850.0,
        category: 'Salary',
        date: twoMonthsAgoDate(1),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'income',
        title: 'Performance Project Bonus',
        amount: 1100.0,
        category: 'Salary',
        date: twoMonthsAgoDate(15),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Apartment Rent',
        amount: 1450.0,
        category: 'Housing & Rent',
        date: twoMonthsAgoDate(2),
        paymentMethod: 'Bank Transfer',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Groceries & Dining Out',
        amount: 520.0,
        category: 'Food & Dining',
        date: twoMonthsAgoDate(7),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Summer Vacation Flight Tickets',
        amount: 450.0,
        category: 'Travel',
        date: twoMonthsAgoDate(18),
        paymentMethod: 'Credit Card',
      },
      {
        user: user._id,
        type: 'expense',
        title: 'Utility Bills & Gas Refill',
        amount: 210.0,
        category: 'Utilities & Bills',
        date: twoMonthsAgoDate(22),
        paymentMethod: 'Debit Card',
      },
    ];

    await Transaction.insertMany(transactions);
    console.log(`[Seed] Successfully inserted ${transactions.length} comprehensive transactions!`);

    // 4. Monthly Category Budgets (Current Month)
    const currentMonthNum = curMonth + 1;
    const budgets = [
      {
        user: user._id,
        category: 'Food & Dining',
        monthlyLimit: 650.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Housing & Rent',
        monthlyLimit: 1500.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Utilities & Bills',
        monthlyLimit: 260.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Transportation',
        monthlyLimit: 200.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Entertainment',
        monthlyLimit: 150.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Healthcare',
        monthlyLimit: 200.0,
        month: currentMonthNum,
        year: curYear,
      },
      {
        user: user._id,
        category: 'Shopping',
        monthlyLimit: 300.0,
        month: currentMonthNum,
        year: curYear,
      },
    ];

    await Budget.insertMany(budgets);
    console.log(`[Seed] Successfully inserted ${budgets.length} category budgets for month ${currentMonthNum}/${curYear}.`);

    console.log('==================================================');
    console.log('✅ DEMO DATA SEEDING COMPLETE FOR USER: Rashan');
    console.log(`Total Incomes & Expenses: ${transactions.length} records`);
    console.log(`Total Budgets: ${budgets.length} categories`);
    console.log('==================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seedDemoData();
