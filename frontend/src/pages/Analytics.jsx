import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import ExpenseCategoryChart from '../components/Charts/ExpenseCategoryChart';
import IncomeVsExpenseChart from '../components/Charts/IncomeVsExpenseChart';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Layers, Sparkles } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const { transactions, summary } = useFinance();
  const currency = user?.currency || '$';

  // Compute category details for table view
  const categoryMap = {};
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      totalExpenses += tx.amount;
    }
  });

  const categoryList = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    total: categoryMap[cat],
    percentage: totalExpenses > 0 ? (categoryMap[cat] / totalExpenses) * 100 : 0,
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Background Visual */}
      <div className="glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Glowing Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Visual Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Financial Analytics & Insights</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Detailed visual breakdown of spending habits, income sources, and category rankings.
          </p>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card glass-card-hover p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded Income</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-400">
            {currency}{summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded Expenses</span>
          </div>
          <h3 className="text-2xl font-black text-rose-400">
            {currency}{summary.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 shadow-xl">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Expense Category</span>
          </div>
          <h3 className="text-xl font-black text-white truncate">
            {categoryList.length > 0 ? categoryList[0].name : 'N/A'}
          </h3>
          {categoryList.length > 0 && (
            <p className="text-xs text-blue-400 font-semibold mt-1">
              {currency}{categoryList[0].total.toFixed(2)} ({categoryList[0].percentage.toFixed(1)}%)
            </p>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <span>Category Spending Distribution</span>
          </h3>
          <ExpenseCategoryChart transactions={transactions} currency={currency} />
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Monthly Cashflow Comparison</span>
          </h3>
          <IncomeVsExpenseChart transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/70 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>Category Expenses Detailed Ranking</span>
        </h3>

        {categoryList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium">
            No expense records logged to rank categories
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Share of Expenses</th>
                  <th className="py-3.5 px-4">Distribution Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {categoryList.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-200">{c.name}</td>
                    <td className="py-3.5 px-4 text-right font-black text-rose-400">
                      {currency}{c.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-300">
                      {c.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 w-48">
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, c.percentage)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
