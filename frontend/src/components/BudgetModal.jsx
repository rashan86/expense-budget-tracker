import React, { useState, useEffect } from 'react';
import { X, PiggyBank, CheckCircle2 } from 'lucide-react';

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

const BudgetModal = ({ isOpen, onClose, onSubmit, initialData = null, currency = '$' }) => {
  const now = new Date();
  const [formData, setFormData] = useState({
    category: EXPENSE_CATEGORIES[0],
    monthlyLimit: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || EXPENSE_CATEGORIES[0],
        monthlyLimit: initialData.monthlyLimit || '',
        month: initialData.month || now.getMonth() + 1,
        year: initialData.year || now.getFullYear(),
      });
    } else {
      setFormData({
        category: EXPENSE_CATEGORIES[0],
        monthlyLimit: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.monthlyLimit || Number(formData.monthlyLimit) <= 0) {
      errs.monthlyLimit = 'Valid monthly limit greater than 0 is required';
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
      monthlyLimit: Number(formData.monthlyLimit),
    });
    setSubmitting(false);

    if (result?.success) {
      onClose();
    } else if (result?.error) {
      setErrors({ form: result.error });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-amber-400" />
            <span>{initialData ? 'Edit Budget Limit' : 'Set Monthly Budget'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.form && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-medium">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Budget Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Monthly Budget Limit ({currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="500"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                className={`w-full pl-9 pr-4 py-3 rounded-xl glass-input text-sm font-semibold ${
                  errors.monthlyLimit ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {errors.monthlyLimit && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.monthlyLimit}</p>
            )}
          </div>

          {/* Month & Year Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
              >
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
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
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Setting...' : 'Set Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
