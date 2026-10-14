import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Calendar, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gift',
  'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing & Rent',
  'Utilities & Bills',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Other Expense',
];

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

// Helper to get local date in YYYY-MM-DD format avoiding UTC shift bugs
const getLocalDateString = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TransactionModal = ({ isOpen, onClose, onSubmit, initialData = null, currency = '$' }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    title: '',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    date: getLocalDateString(),
    paymentMethod: 'Cash',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        date: getLocalDateString(initialData.date),
        paymentMethod: initialData.paymentMethod || 'Cash',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        type: 'expense',
        title: '',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        date: getLocalDateString(),
        paymentMethod: 'Cash',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid amount greater than 0 is required';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
    setSubmitting(false);

    if (result?.success) {
      onClose();
    } else if (result?.error) {
      setErrors({ form: result.error });
    }
  };

  if (!isOpen) return null;

  const currentCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>{initialData ? 'Edit Transaction' : 'Add New Transaction'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Toggle: Income / Expense */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                formData.type === 'expense'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                formData.type === 'income'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Title / Description *
            </label>
            <input
              type="text"
              placeholder="e.g., Grocery Shopping, Monthly Salary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                errors.title ? 'border-rose-500' : ''
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount ({currency}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">
                  {currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl glass-input text-sm font-semibold ${
                    errors.amount ? 'border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.amount}</p>}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
              >
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              } ${submitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
