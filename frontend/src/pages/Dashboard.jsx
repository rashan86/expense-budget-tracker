import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ExpenseCategoryChart from '../components/Charts/ExpenseCategoryChart';
import IncomeVsExpenseChart from '../components/Charts/IncomeVsExpenseChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  PiggyBank, 
  Plus, 
  AlertTriangle, 
  ArrowRight,
  Edit2,
  Trash2,
  Calendar,
  Download,
  Receipt,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ onOpenTransactionModal, onOpenBudgetModal, onOpenExportModal, onEditTransaction }) => {
  const { user } = useAuth();
  const { transactions, summary, budgetsData, loading, deleteTransaction } = useFinance();

  const currency = user?.currency || '$';

  // Calculate budget progress overview
  const totalBudgeted = budgetsData.totalBudgeted || 0;
  const totalSpent = budgetsData.totalSpent || 0;
  const budgetProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  // Calculate real-world financial KPI: Savings Rate %
  const savingsRate = summary.totalIncome > 0
    ? Math.max(0, ((summary.balance / summary.totalIncome) * 100)).toFixed(1)
    : 0;

  // Filter budget alert warnings
  const budgetAlerts = budgetsData.budgets?.filter((b) => b.status === 'warning' || b.status === 'exceeded') || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Welcome & Quick Action Hero Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden group">
        {/* Glow ambient background aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Financial Command Center</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">{user?.name}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Here is your live personal finance snapshot, budget compliance alerts, and spending breakdown.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => onOpenTransactionModal()}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Budget Over-Limit Warning Alerts Banner */}
      {budgetAlerts.length > 0 && (
        <div className="glass-card p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-rose-500/10 flex items-start space-x-4 shadow-xl">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              Budget Spending Alerts ({budgetAlerts.length})
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {budgetAlerts.map((b) => (
                <span
                  key={b._id}
                  className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold ${
                    b.status === 'exceeded'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {b.category}: {b.percentage}% used ({currency}{b.spent.toLocaleString()} / {currency}{b.monthlyLimit.toLocaleString()})
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 shrink-0 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
          >
            <span>Manage Budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top Key Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Income"
          amount={summary.totalIncome}
          currency={currency}
          icon={TrendingUp}
          type="income"
          subtitle="All recorded earnings"
        />
        <StatCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          currency={currency}
          icon={TrendingDown}
          type="expense"
          subtitle="All recorded spending"
        />
        <StatCard
          title="Net Balance"
          amount={summary.balance}
          currency={currency}
          icon={Scale}
          type={summary.balance >= 0 ? 'balance' : 'expense'}
          subtitle={summary.balance >= 0 ? `Positive (${savingsRate}% Savings Rate)` : 'Deficit (Spending > Income)'}
        />
        <StatCard
          title="Monthly Budget Limit"
          amount={totalBudgeted}
          currency={currency}
          icon={PiggyBank}
          type="warning"
          progress={budgetProgress}
          subtitle={`${currency}${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })} spent out of ${currency}${totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart: Expense Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Expense Category Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">All Time</span>
          </div>
          <ExpenseCategoryChart transactions={transactions} currency={currency} />
        </div>

        {/* Bar Chart: Income vs Expense Trend */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Monthly Cashflow Comparison</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">Monthly History</span>
          </div>
          <IncomeVsExpenseChart transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/70 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <span>Recent Activity Log</span>
            </h3>
            <p className="text-xs text-slate-400">Latest recorded income and expense transactions</p>
          </div>
          <Link
            to="/transactions"
            className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20"
          >
            <span>View All Records</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No transactions recorded yet</p>
            <button
              onClick={() => onOpenTransactionModal()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg"
            >
              Add First Record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Transaction</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {transactions.slice(0, 6).map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div>{tx.title}</div>
                      {tx.notes && <div className="text-xs font-normal text-slate-500 truncate max-w-xs">{tx.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {tx.paymentMethod || 'Cash'}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-black ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
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
      </div>
    </div>
  );
};

export default Dashboard;
