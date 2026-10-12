require('./config/dnsFix');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check API with Database Diagnostic Status
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'Expense & Budget Tracker API',
    database: {
      connected: isConnected,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
      readyState: mongoose.connection.readyState,
      statusText: isConnected ? 'Connected to MongoDB' : 'Disconnected / Connecting',
    },
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server after database initialization
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to initialize database during startup:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();

