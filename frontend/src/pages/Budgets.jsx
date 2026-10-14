import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { 
  PiggyBank, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Edit3, 
  Calendar,
  Sparkles
} from 'lucide-react';

const Budgets = ({ onOpenBudgetModal }) => {
  const { user } = useAuth();
  const { budgetsData, fetchBudgets, deleteBudgetLimit } = useFinance();
  const currency = user?.currency || '$';

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(budgetsData.month || now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(budgetsData.year || now.getFullYear());

  const handleMonthChange = (e) => {
    const m = parseInt(e.target.value, 10);
    setSelectedMonth(m);
    fetchBudgets(m, selectedYear);
  };

  const handleYearChange = (e) => {
    const y = parseInt(e.target.value, 10);
    setSelectedYear(y);
    fetchBudgets(selectedMonth, y);
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget target?')) {
      await deleteBudgetLimit(id);
    }
  };

  const budgets = budgetsData.budgets || [];
  const totalBudgeted = budgetsData.totalBudgeted || 0;
  const totalSpent = budgetsData.totalSpent || 0;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Background Visual */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Glowing Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Budget Control</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Monthly Category Budgets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Set target monthly spending limits for each category to keep your finances on track.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          {/* Month & Year Select */}
          <div className="flex items-center space-x-2 glass-input px-3.5 py-2 rounded-xl text-xs">
            <Calendar className="w-4 h-4 text-blue-400" />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m} className="bg-[#070A11]">
                  {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
                <option key={y} value={y} className="bg-[#070A11]">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenBudgetModal()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Set Budget Limit</span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Budget</p>
          <h3 className="text-2xl font-black text-white mt-1">
            {currency}{totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent so far</p>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {currency}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 shadow-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Budget Health</p>
          <h3 className={`text-2xl font-black mt-1 ${totalSpent > totalBudgeted ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalBudgeted > 0 ? `${((totalSpent / totalBudgeted) * 100).toFixed(0)}% Used` : 'No limits set'}
          </h3>
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Active Category Goals ({budgets.length})</span>
        </h3>

        {budgets.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-700/60 shadow-xl">
            <PiggyBank className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No monthly budgets set yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Set monthly budget targets for Food, Rent, Entertainment, and other categories to avoid overspending.
            </p>
            <button
              onClick={() => onOpenBudgetModal()}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-600/30"
            >
              Set First Budget Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b) => (
              <div
                key={b._id}
                className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-700/70 space-y-4 relative shadow-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                      {b.category.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{b.category}</h4>
                      <p className="text-xs text-slate-400">
                        {currency}{b.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent of {currency}{b.monthlyLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} limit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenBudgetModal(b)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Edit Budget"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(b._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span
                      className={
                        b.status === 'exceeded'
                          ? 'text-rose-400'
                          : b.status === 'warning'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {b.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.status === 'exceeded'
                          ? 'bg-rose-500 shadow-rose-500/50'
                          : b.status === 'warning'
                          ? 'bg-amber-500 shadow-amber-500/50'
                          : 'bg-emerald-500 shadow-emerald-500/50'
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-400 font-medium">
                    Remaining: <span className="font-bold text-white">{currency}{b.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </span>

                  {b.status === 'exceeded' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Over Budget!</span>
                    </span>
                  )}
                  {b.status === 'warning' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Near Limit (&gt;80%)</span>
                    </span>
                  )}
                  {b.status === 'ok' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>On Track</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
