import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  X,
  FileSpreadsheet,
  FileText,
  Receipt,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Gift',
  'Other Income',
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

const Transactions = ({ onOpenTransactionModal, onOpenExportModal, onEditTransaction }) => {
  const { user } = useAuth();
  const { transactions, pagination, filters, updateFilters, deleteTransaction, loading } = useFinance();
  const currency = user?.currency || '$';

  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    updateFilters({
      search: '',
      type: 'All',
      category: 'All',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Background Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Glowing Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Transaction Database</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Transactions History</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Search, filter, manage, and export all your income and expense records.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 shadow-md"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV/PDF</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-5 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by description, category, or notes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value, page: 1 })}
            className="px-4 py-2.5 rounded-xl glass-input text-xs font-medium bg-[#070A11]"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}
            className="px-4 py-2.5 rounded-xl glass-input text-xs font-medium bg-[#070A11]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            Search
          </button>

          {(filters.search || filters.type !== 'All' || filters.category !== 'All' || filters.startDate || filters.endDate) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Date Range Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400 font-semibold flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Date Range:</span>
          </span>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilters({ startDate: e.target.value, page: 1 })}
            className="px-3 py-1.5 rounded-lg glass-input text-xs"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilters({ endDate: e.target.value, page: 1 })}
            className="px-3 py-1.5 rounded-lg glass-input text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/70 space-y-4 shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            Fetching transaction records...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-400">No matching transactions found</p>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or date filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Title / Notes</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      <div>{tx.title}</div>
                      {tx.notes && <div className="text-xs font-normal text-slate-500 truncate max-w-xs">{tx.notes}</div>}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {tx.paymentMethod || 'Cash'}
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-black text-base ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium">
              Showing page <span className="font-bold text-white">{pagination.page}</span> of{' '}
              <span className="font-bold text-white">{pagination.pages}</span> ({pagination.total} total records)
            </p>

            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateFilters({ page: pagination.page - 1 })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateFilters({ page: p })}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    pagination.page === p
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => updateFilters({ page: pagination.page + 1 })}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
