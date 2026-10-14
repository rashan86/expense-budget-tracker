import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import ExpenseCategoryChart from '../components/Charts/ExpenseCategoryChart';
import IncomeVsExpenseChart from '../components/Charts/IncomeVsExpenseChart';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Zap, 
  Target, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Compass, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NEEDS_CATEGORIES = [
  'Housing & Rent',
  'Utilities & Bills',
  'Food & Dining',
  'Healthcare',
  'Transportation',
  'Education',
];

const WANTS_CATEGORIES = [
  'Entertainment',
  'Shopping',
  'Travel',
  'Other Expense',
];

const Analytics = () => {
  const { user } = useAuth();
  const { transactions, summary, budgetsData } = useFinance();
  const currency = user?.currency || '$';

  // Compute category details for table view
  const categoryMap = {};
  let totalExpenses = 0;
  let needsSpent = 0;
  let wantsSpent = 0;

  // Track recurring/fixed subscriptions
  const recurringKeywords = ['netflix', 'spotify', 'subscription', 'rent', 'bill', 'fiber', 'wifi', 'electricity', 'water', 'gym', 'insurance'];
  const detectedRecurring = [];

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      totalExpenses += tx.amount;

      if (NEEDS_CATEGORIES.includes(tx.category)) {
        needsSpent += tx.amount;
      } else if (WANTS_CATEGORIES.includes(tx.category)) {
        wantsSpent += tx.amount;
      }

      const lowerTitle = (tx.title + ' ' + (tx.notes || '')).toLowerCase();
      if (recurringKeywords.some((k) => lowerTitle.includes(k))) {
        detectedRecurring.push(tx);
      }
    }
  });

  const categoryList = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    total: categoryMap[cat],
    percentage: totalExpenses > 0 ? (categoryMap[cat] / totalExpenses) * 100 : 0,
  })).sort((a, b) => b.total - a.total);

  // 1. 50/30/20 Rule Calculations
  const incomeBasis = summary.totalIncome > 0 ? summary.totalIncome : totalExpenses;
  const netSavings = Math.max(0, summary.totalIncome - totalExpenses);

  const needsPercentage = incomeBasis > 0 ? (needsSpent / incomeBasis) * 100 : 0;
  const wantsPercentage = incomeBasis > 0 ? (wantsSpent / incomeBasis) * 100 : 0;
  const savingsPercentage = summary.totalIncome > 0 ? (netSavings / summary.totalIncome) * 100 : 0;

  // 2. Financial Health Score (0 - 100)
  // Component A: Savings Efficiency (Max 35)
  const savingsScore = Math.min(35, (savingsPercentage / 20) * 35);

  // Component B: Budget Compliance (Max 35)
  const budgets = budgetsData.budgets || [];
  let budgetScore = 30; // default baseline
  if (budgets.length > 0) {
    const exceededCount = budgets.filter((b) => b.status === 'exceeded').length;
    const warningCount = budgets.filter((b) => b.status === 'warning').length;
    budgetScore = Math.max(5, 35 - (exceededCount * 12) - (warningCount * 5));
  }

  // Component C: Cash Flow Stability (Max 30)
  const cashflowScore = summary.balance > 0 ? 30 : summary.balance === 0 ? 15 : 5;

  const healthScore = Math.min(100, Math.max(10, Math.round(savingsScore + budgetScore + cashflowScore)));

  let healthGrade = { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  if (healthScore < 55) {
    healthGrade = { label: 'Needs Attention', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  } else if (healthScore < 75) {
    healthGrade = { label: 'Good Stability', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
  }

  // 3. Daily Burn Rate & Month-End Forecast
  const now = new Date();
  const currentDay = Math.max(1, now.getDate());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay);

  // Current month expenses
  const monthlyExpenseTotal = budgetsData.totalSpent > 0 ? budgetsData.totalSpent : totalExpenses;
  const dailyBurnRate = monthlyExpenseTotal / currentDay;
  const projectedMonthEnd = dailyBurnRate * daysInMonth;
  const totalBudgeted = budgetsData.totalBudgeted || 0;
  const safeDailyAllowance = totalBudgeted > monthlyExpenseTotal
    ? (totalBudgeted - monthlyExpenseTotal) / daysRemaining
    : 0;

  // Recurring subscriptions total
  const recurringTotal = detectedRecurring.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner with Background Visual */}
      <div className="glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Glowing Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Financial Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Financial Analytics & Insights Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Automated 50/30/20 budget compliance, financial health score, daily burn velocity, and predictive forecasts.
          </p>
        </div>
      </div>

      {/* Financial Health Score & Burn Rate Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Composite Financial Health Score */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Financial Health Score</span>
              </h3>
              <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${healthGrade.bg} ${healthGrade.color} ${healthGrade.border}`}>
                {healthGrade.label}
              </span>
            </div>

            <div className="flex items-center space-x-5 my-6">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                {/* Score Circle Progress Indicator */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={healthScore >= 75 ? 'text-emerald-400' : healthScore >= 55 ? 'text-amber-400' : 'text-rose-400'}
                    strokeDasharray={`${healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{healthScore}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">/ 100</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Savings Rate:</span>
                  <span className="font-bold text-white">{savingsPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Budget Limit:</span>
                  <span className="font-bold text-emerald-400">
                    {totalBudgeted > 0 ? `${((monthlyExpenseTotal / totalBudgeted) * 100).toFixed(0)}% Used` : 'No limits'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Cash Flow:</span>
                  <span className={`font-bold ${summary.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {summary.balance >= 0 ? 'Positive Surplus' : 'Negative Deficit'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-start space-x-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              {healthScore >= 75
                ? 'Excellent financial control! Maintain your 20%+ savings rate to build compound wealth.'
                : healthScore >= 55
                ? 'Stable financial footing. Lower your discretionary wants to lift savings above 20%.'
                : 'Spending is exceeding income limits. Review your active budget alerts and recurring bills.'}
            </p>
          </div>
        </div>

        {/* Card 2: Daily Burn Rate & Month-End Forecast */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Spending Velocity & Burn Rate</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
                Day {currentDay} of {daysInMonth}
              </span>
            </div>

            <div className="my-5 grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average Daily Burn</p>
                <p className="text-xl font-black text-white mt-1">
                  {currency}{dailyBurnRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">per calendar day</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Safe Daily Allowance</p>
                <p className={`text-xl font-black mt-1 ${safeDailyAllowance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currency}{safeDailyAllowance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">for next {daysRemaining} days</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Month-End Outflow:</span>
                <span className="font-extrabold text-white">
                  {currency}{projectedMonthEnd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${totalBudgeted > 0 && projectedMonthEnd > totalBudgeted ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, totalBudgeted > 0 ? (projectedMonthEnd / totalBudgeted) * 100 : (currentDay / daysInMonth) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Month-End Status:</span>
            <span className={`font-bold ${totalBudgeted > 0 && projectedMonthEnd <= totalBudgeted ? 'text-emerald-400' : 'text-slate-300'}`}>
              {totalBudgeted > 0
                ? projectedMonthEnd <= totalBudgeted
                  ? `On Target (${currency}${(totalBudgeted - projectedMonthEnd).toFixed(0)} under budget)`
                  : `Projected Overrun (${currency}${(projectedMonthEnd - totalBudgeted).toFixed(0)})`
                : 'Within steady baseline'}
            </span>
          </div>
        </div>

        {/* Card 3: Recurring Subscriptions & Fixed Bills */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Detected Fixed Commitments</span>
              </h3>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                {detectedRecurring.length} Subscriptions/Bills
              </span>
            </div>

            <div className="my-4">
              <p className="text-xs text-slate-400">Total Monthly Fixed Recurring Outflow:</p>
              <h2 className="text-3xl font-black text-white mt-1">
                {currency}{recurringTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Accounts for <span className="text-blue-400 font-bold">{summary.totalIncome > 0 ? ((recurringTotal / summary.totalIncome) * 100).toFixed(1) : 0}%</span> of total income
              </p>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {detectedRecurring.slice(0, 3).map((r) => (
                <div key={r._id} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs">
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-200 truncate">{r.title}</p>
                    <p className="text-[10px] text-slate-400">{r.category}</p>
                  </div>
                  <span className="font-black text-rose-400 shrink-0">
                    {currency}{r.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/transactions"
            className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Audit all subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* The 50 / 30 / 20 Budget Rule Breakdown Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Gold Standard Benchmark</span>
            </div>
            <h2 className="text-2xl font-black text-white">The 50 / 30 / 20 Rule Analysis</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-world financial guidelines divide take-home income into 50% Essential Needs, 30% Lifestyle Wants, and 20% Net Savings & Surplus.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-semibold">Your Status:</span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black border ${
              wantsPercentage <= 30 && savingsPercentage >= 20
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              {wantsPercentage <= 30 && savingsPercentage >= 20 ? 'Optimal Compliance' : 'Balanced Flow'}
            </span>
          </div>
        </div>

        {/* 3 Columns: Needs, Wants, Savings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Column 1: Needs (50%) */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Essential Needs</span>
                <h4 className="text-xl font-black text-white mt-0.5">50% Target</h4>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 font-black text-sm">
                {needsPercentage.toFixed(1)}%
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Rent, Utilities, Groceries, Healthcare, and Transportation.
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Spent Amount:</span>
                <span className="font-extrabold text-white">
                  {currency}{needsSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${needsPercentage > 55 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, needsPercentage)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 text-right">Target ceiling: 50.0%</p>
            </div>
          </div>

          {/* Column 2: Wants (30%) */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Lifestyle Wants</span>
                <h4 className="text-xl font-black text-white mt-0.5">30% Target</h4>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 font-black text-sm">
                {wantsPercentage.toFixed(1)}%
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Entertainment, Dining Out, Shopping, Vacations, and Subscriptions.
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Spent Amount:</span>
                <span className="font-extrabold text-white">
                  {currency}{wantsSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${wantsPercentage > 30 ? 'bg-rose-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min(100, wantsPercentage)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 text-right">Target ceiling: 30.0%</p>
            </div>
          </div>

          {/* Column 3: Savings & Investments (20%) */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Savings & Surplus</span>
                <h4 className="text-xl font-black text-white mt-0.5">20% Target</h4>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm">
                {savingsPercentage.toFixed(1)}%
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Emergency buffer, retirement fund, debt reduction, and investments.
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Net Savings:</span>
                <span className="font-extrabold text-emerald-400">
                  {currency}{netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, savingsPercentage)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 text-right">Target minimum: 20.0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>Category Spending Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">All Time</span>
          </div>
          <ExpenseCategoryChart transactions={transactions} currency={currency} />
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Monthly Cashflow Comparison</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">Monthly History</span>
          </div>
          <IncomeVsExpenseChart transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/70 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Category Outflow Breakdown & Ranking</span>
            </h3>
            <p className="text-xs text-slate-400">Ranked by highest expense category to identify savings opportunities</p>
          </div>
        </div>

        {categoryList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium">
            No expense records logged to rank categories
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Rank & Category</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4 text-right">Total Outflow</th>
                  <th className="py-3.5 px-4 text-right">Share of Expenses</th>
                  <th className="py-3.5 px-4">Distribution Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {categoryList.map((c, index) => {
                  const isNeed = NEEDS_CATEGORIES.includes(c.name);
                  return (
                    <tr key={c.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-200 flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[11px] font-extrabold flex items-center justify-center border border-slate-700">
                          {index + 1}
                        </span>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                          isNeed
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {isNeed ? 'Essential Need' : 'Lifestyle Want'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-rose-400">
                        {currency}{c.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-300">
                        {c.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 w-48">
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={isNeed ? 'bg-blue-500 h-full rounded-full' : 'bg-purple-500 h-full rounded-full'}
                            style={{ width: `${Math.min(100, c.percentage)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
