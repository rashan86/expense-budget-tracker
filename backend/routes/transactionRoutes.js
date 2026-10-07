const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV,
  exportPDF,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all transaction endpoints

router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

router.route('/')
  .get(getTransactions)
  .post(addTransaction);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
