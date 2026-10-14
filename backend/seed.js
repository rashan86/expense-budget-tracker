require('./config/dnsFix');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
    await mongoose.connect(connStr);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    // Create Demo User
    const demoUser = await User.create({
      name: 'Rashan',
      email: 'john@example.com',
      password: 'password123',
      currency: '$',
    });

    console.log(`Created Demo User: ${demoUser.email} (Password: password123)`);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Sample Transactions
    const sampleTransactions = [
      {
        user: demoUser._id,
        type: 'income',
        title: 'Monthly Software Engineer Salary',
        amount: 4500.0,
        category: 'Salary',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        paymentMethod: 'Bank Transfer',
        notes: 'Tech Corp monthly salary deposit',
      },
      {
        user: demoUser._id,
        type: 'income',
        title: 'Freelance Web Design Project',
        amount: 850.0,
        category: 'Freelance',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        paymentMethod: 'Bank Transfer',
        notes: 'Completed client landing page redesign',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Monthly Apartment Rent',
        amount: 1400.0,
        category: 'Housing & Rent',
        date: new Date(now.getFullYear(), now.getMonth(), 2),
        paymentMethod: 'Bank Transfer',
        notes: 'Downtown apartment rental payment',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Whole Foods Grocery Shopping',
        amount: 320.5,
        category: 'Food & Dining',
        date: new Date(now.getFullYear(), now.getMonth(), 4),
        paymentMethod: 'Credit Card',
        notes: 'Weekly fresh groceries',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Electricity & High-speed Fiber Bill',
        amount: 185.0,
        category: 'Utilities & Bills',
        date: new Date(now.getFullYear(), now.getMonth(), 6),
        paymentMethod: 'Debit Card',
        notes: 'Monthly utility bill',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Weekend Dining & Coffee with Friends',
        amount: 145.0,
        category: 'Food & Dining',
        date: new Date(now.getFullYear(), now.getMonth(), 7),
        paymentMethod: 'Credit Card',
        notes: 'Italian restaurant dinner',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Netflix & Spotify Premium Subscriptions',
        amount: 24.99,
        category: 'Entertainment',
        date: new Date(now.getFullYear(), now.getMonth(), 8),
        paymentMethod: 'Credit Card',
        notes: 'Monthly digital subscriptions',
      },
      {
        user: demoUser._id,
        type: 'expense',
        title: 'Gas Station Refill',
        amount: 65.0,
        category: 'Transportation',
        date: new Date(now.getFullYear(), now.getMonth(), 9),
        paymentMethod: 'Credit Card',
        notes: 'Full tank fuel',
      },
    ];

    await Transaction.insertMany(sampleTransactions);
    console.log(`Inserted ${sampleTransactions.length} sample transactions.`);

    // Sample Monthly Budgets
    const sampleBudgets = [
      {
        user: demoUser._id,
        category: 'Food & Dining',
        monthlyLimit: 600.0,
        month: currentMonth,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Housing & Rent',
        monthlyLimit: 1500.0,
        month: currentMonth,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Utilities & Bills',
        monthlyLimit: 200.0,
        month: currentMonth,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Entertainment',
        monthlyLimit: 150.0,
        month: currentMonth,
        year: currentYear,
      },
      {
        user: demoUser._id,
        category: 'Transportation',
        monthlyLimit: 200.0,
        month: currentMonth,
        year: currentYear,
      },
    ];

    await Budget.insertMany(sampleBudgets);
    console.log(`Inserted ${sampleBudgets.length} sample budget limits.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
    process.exit(1);
  }
};

seedData();
