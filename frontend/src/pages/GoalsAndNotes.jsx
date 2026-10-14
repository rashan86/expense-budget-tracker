import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Target, 
  StickyNote, 
  Activity, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Trash2, 
  Pin, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  AlertCircle,
  X,
  Laptop,
  Plane,
  HeartHandshake,
  Car,
  Home
} from 'lucide-react';

const GOAL_CATEGORIES = [
  'Emergency Fund',
  'Travel & Vacation',
  'Gadgets & Tech',
  'Vehicle',
  'Home & Real Estate',
  'Investment',
  'Education',
  'General Savings'
];

const NOTE_TAGS = [
  'Reminder',
  'Subscription',
  'Tax & Legal',
  'Budget Rule',
  'Investment Idea',
  'General'
];

const GoalsAndNotes = () => {
  const { user } = useAuth();
  const { transactions, budgetsData } = useFinance();
  const currency = user?.currency || '$';

  // Active Tab: 'goals' | 'notes' | 'activity'
  const [activeTab, setActiveTab] = useState('goals');

  // Storage Keys unique to user
  const userKey = user?.email || 'default';
  const GOALS_STORAGE_KEY = `fp_goals_${userKey}`;
  const NOTES_STORAGE_KEY = `fp_notes_${userKey}`;
  const LOGS_STORAGE_KEY = `fp_custom_logs_${userKey}`;

  // Default Initial Goals
  const initialGoals = [
    {
      id: 'g-1',
      title: '6-Month Emergency Fund',
      category: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 3450,
      targetDate: '2026-12-31',
      color: 'emerald',
    },
    {
      id: 'g-2',
      title: 'M3 Pro MacBook Setup',
      category: 'Gadgets & Tech',
      targetAmount: 2200,
      currentAmount: 1850,
      targetDate: '2026-11-20',
      color: 'blue',
    },
    {
      id: 'g-3',
      title: 'Bali Vacation Trip',
      category: 'Travel & Vacation',
      targetAmount: 3000,
      currentAmount: 1200,
      targetDate: '2027-03-15',
      color: 'purple',
    }
  ];

  // Default Initial Notes
  const initialNotes = [
    {
      id: 'n-1',
      title: 'Annual Adobe Subscription Renewal',
      content: 'Check whether team plan is needed or downgrade to single app before the 25th of next month to save $30/mo.',
      tag: 'Subscription',
      color: 'rose',
      pinned: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
    },
    {
      id: 'n-2',
      title: '50/30/20 Target Rule for Q4',
      content: 'Keep Wants under 30% of net income. Re-allocate freelance surplus directly into High-Yield Savings Account.',
      tag: 'Budget Rule',
      color: 'indigo',
      pinned: true,
      createdAt: new Date(Date.now() - 86400000 * 4).toLocaleDateString(),
    },
    {
      id: 'n-3',
      title: 'Electricity & Utility Audit',
      content: 'Switch main workspace server to low power standby profile. Check utility bill variance next week.',
      tag: 'Reminder',
      color: 'amber',
      pinned: false,
      createdAt: new Date(Date.now() - 86400000 * 6).toLocaleDateString(),
    }
  ];

  // State
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(GOALS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialGoals;
    } catch {
      return initialGoals;
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [customLogs, setCustomLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals, GOALS_STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes, NOTES_STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(customLogs));
  }, [customLogs, LOGS_STORAGE_KEY]);

  // Modal States
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // New Goal Form
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: GOAL_CATEGORIES[0],
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    color: 'emerald',
  });

  // New Note Form
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tag: NOTE_TAGS[0],
    color: 'indigo',
    pinned: false,
  });

  // Activity Filter State
  const [activityFilter, setActivityFilter] = useState('all');

  // Record a Log Event Helper
  const addLogEvent = (type, title, description, amount = null, category = 'General') => {
    const entry = {
      id: 'log-' + Date.now(),
      type, // 'deposit' | 'goal' | 'note' | 'budget'
      title,
      description,
      amount,
      category,
      timestamp: new Date().toISOString(),
    };
    setCustomLogs((prev) => [entry, ...prev.slice(0, 49)]);
  };

  // Handle Goal Creation
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetAmount) return;

    const created = {
      id: 'g-' + Date.now(),
      title: newGoal.title,
      category: newGoal.category,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount || 0),
      targetDate: newGoal.targetDate || new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      color: newGoal.color,
    };

    setGoals((prev) => [created, ...prev]);
    addLogEvent('goal', 'New Savings Goal Created', `Created target for "${created.title}"`, created.targetAmount, created.category);
    setIsGoalModalOpen(false);
    setNewGoal({
      title: '',
      category: GOAL_CATEGORIES[0],
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      color: 'emerald',
    });
  };

  // Handle Deposit to Goal
  const handleDepositToGoal = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || !selectedGoalForDeposit) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === selectedGoalForDeposit.id) {
          const updatedCurrent = g.currentAmount + amt;
          return { ...g, currentAmount: updatedCurrent };
        }
        return g;
      })
    );

    addLogEvent('deposit', 'Deposit to Savings Goal', `Added ${currency}${amt.toLocaleString()} to "${selectedGoalForDeposit.title}"`, amt, selectedGoalForDeposit.category);
    setIsDepositModalOpen(false);
    setDepositAmount('');
    setSelectedGoalForDeposit(null);
  };

  // Delete Goal
  const handleDeleteGoal = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      addLogEvent('goal', 'Savings Goal Removed', `Deleted goal: ${title}`);
    }
  };

  // Handle Note Creation
  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    const created = {
      id: 'n-' + Date.now(),
      title: newNote.title,
      content: newNote.content,
      tag: newNote.tag,
      color: newNote.color,
      pinned: newNote.pinned,
      createdAt: new Date().toLocaleDateString(),
    };

    setNotes((prev) => [created, ...prev]);
    addLogEvent('note', 'Financial Memo Saved', `Added memo: "${created.title}"`, null, created.tag);
    setIsNoteModalOpen(false);
    setNewNote({
      title: '',
      content: '',
      tag: NOTE_TAGS[0],
      color: 'indigo',
      pinned: false,
    });
  };

  // Toggle Note Pin
  const handleTogglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Delete Note
  const handleDeleteNote = (id, title) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addLogEvent('note', 'Note Removed', `Deleted note: "${title}"`);
  };

  // Build Unified Activity Feed
  const unifiedActivities = [
    // 1. Transaction activities from real database
    ...(transactions || []).map((tx) => ({
      id: 'tx-' + tx._id,
      type: tx.type === 'income' ? 'income' : 'expense',
      title: tx.type === 'income' ? `Income: ${tx.category}` : `Expense: ${tx.category}`,
      description: tx.description || `${tx.category} transaction logged`,
      amount: tx.amount,
      category: tx.category,
      timestamp: tx.date || tx.createdAt,
      source: 'database',
    })),
    // 2. Custom goal/note activities
    ...customLogs.map((cl) => ({
      ...cl,
      source: 'planner',
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filter activities
  const filteredActivities = unifiedActivities.filter((act) => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'income') return act.type === 'income';
    if (activityFilter === 'expense') return act.type === 'expense';
    if (activityFilter === 'goals') return act.type === 'goal' || act.type === 'deposit';
    if (activityFilter === 'notes') return act.type === 'note';
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card bg-banner-visual p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financial Planning Hub</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Goals, Notes & Activity Log</span>
          </h1>
          <p className="text-sm text-slate-300 font-medium max-w-xl">
            Track category milestones, pin critical financial memos, and audit every ledger event in real-time.
          </p>
        </div>

        {/* Action Button based on Active Tab */}
        <div className="relative z-10 flex items-center space-x-3">
          {activeTab === 'goals' && (
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Goal</span>
            </button>
          )}

          {activeTab === 'notes' && (
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pill Switcher */}
      <div className="flex items-center space-x-2 glass-card p-1.5 rounded-2xl border border-slate-700/60 max-w-md shadow-lg">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'goals'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Savings Goals</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-semibold">{goals.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <StickyNote className="w-4 h-4" />
          <span>Notes & Memos</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/60 font-semibold">{notes.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'activity'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* ======================= TAB 1: SAVINGS GOALS ======================= */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-700/60 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Targets</span>
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Target className="w-5 h-5" />
                </span>
              </div>
              <p className="text-2xl font-black text-white mt-3">
                {currency}{goals.reduce((acc, g) => acc + g.targetAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">{goals.length} active savings milestones</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-700/60 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Saved</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <PiggyBank className="w-5 h-5" />
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-3">
                {currency}{goals.reduce((acc, g) => acc + g.currentAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-300 mt-1">Accumulated across targets</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-700/60 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <TrendingUp className="w-5 h-5" />
                </span>
              </div>
              {(() => {
                const totalT = goals.reduce((acc, g) => acc + g.targetAmount, 0);
                const totalC = goals.reduce((acc, g) => acc + g.currentAmount, 0);
                const pct = totalT > 0 ? ((totalC / totalT) * 100).toFixed(1) : 0;
                return (
                  <>
                    <p className="text-2xl font-black text-purple-400 mt-3">{pct}%</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {currency}{(totalT - totalC > 0 ? totalT - totalC : 0).toLocaleString()} remaining
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isAchieved = goal.currentAmount >= goal.targetAmount;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              return (
                <div
                  key={goal.id}
                  className="chart-glass-card p-6 rounded-3xl flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-all duration-300"
                >
                  <div className="chart-watermark-grid" />
                  <div className="chart-watermark-glow-emerald" />

                  <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {goal.category}
                        </span>
                        <h3 className="text-lg font-bold text-white tracking-tight mt-1">{goal.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id, goal.title)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar & Amount */}
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-white">
                          {currency}{goal.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Target: {currency}{goal.targetAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 overflow-hidden border border-slate-700/60">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isAchieved
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className={`font-bold ${isAchieved ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {pct}% Completed
                        </span>
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {goal.targetDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {isAchieved ? (
                      <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Milestone reached! Target is 100% funded.</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span>Remaining:</span>
                        <span className="font-bold text-slate-200">{currency}{remaining.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedGoalForDeposit(goal);
                        setIsDepositModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Deposit Funds</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: FINANCIAL NOTES & MEMOS ======================= */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Pin important financial obligations, tax rules, and budget notes directly to your board.
            </p>
            <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-800/40">
              Auto-saved locally
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes
              .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
              .map((note) => {
                const colorBorder = 
                  note.color === 'rose' ? 'border-rose-500/40 hover:border-rose-500/60' :
                  note.color === 'amber' ? 'border-amber-500/40 hover:border-amber-500/60' :
                  note.color === 'emerald' ? 'border-emerald-500/40 hover:border-emerald-500/60' :
                  'border-indigo-500/40 hover:border-indigo-500/60';

                const colorBadge =
                  note.color === 'rose' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                  note.color === 'amber' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                  note.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                  'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';

                return (
                  <div
                    key={note.id}
                    className={`chart-glass-card p-6 rounded-3xl border ${colorBorder} flex flex-col justify-between space-y-4 shadow-xl transition-all duration-300 group`}
                  >
                    <div className="chart-watermark-grid" />
                    <div className="chart-watermark-glow-indigo" />

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colorBadge}`}>
                          {note.tag}
                        </span>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleTogglePin(note.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              note.pinned ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id, note.title)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight">{note.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                        {note.content}
                      </p>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <span>{note.createdAt}</span>
                      {note.pinned && (
                        <span className="text-[10px] font-bold text-amber-400/90 flex items-center space-x-1">
                          <Pin className="w-3 h-3" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: ACTIVITY LOG ======================= */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Activity Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Events:</span>
              <div className="flex items-center space-x-1.5 glass-card p-1 rounded-xl border border-slate-700/60">
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'income', label: 'Income' },
                  { id: 'expense', label: 'Expenses' },
                  { id: 'goals', label: 'Goals & Deposits' },
                  { id: 'notes', label: 'Memos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActivityFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activityFilter === f.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredActivities.length} audit records
            </span>
          </div>

          {/* Activity Timeline List */}
          <div className="chart-glass-card rounded-3xl p-6 border border-slate-700/70 shadow-xl relative">
            <div className="chart-watermark-grid" />
            <div className="chart-watermark-glow-indigo" />

            <div className="relative z-10 space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No activity logs found for this filter</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {filteredActivities.slice(0, 30).map((act) => {
                    const isIncome = act.type === 'income' || act.type === 'deposit';
                    const isExpense = act.type === 'expense';
                    const isGoal = act.type === 'goal';
                    const isNote = act.type === 'note';

                    const iconColor = isIncome
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : isExpense
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      : isGoal
                      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                      : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

                    return (
                      <div key={act.id} className="py-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-3 rounded-2xl transition-colors">
                        <div className="flex items-center space-x-3.5">
                          <div className={`p-2.5 rounded-xl border ${iconColor} shrink-0`}>
                            {isIncome && <ArrowDownLeft className="w-4 h-4" />}
                            {isExpense && <ArrowUpRight className="w-4 h-4" />}
                            {isGoal && <Target className="w-4 h-4" />}
                            {isNote && <StickyNote className="w-4 h-4" />}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-white">{act.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                                {act.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {act.amount !== null && (
                            <p className={`text-sm font-black ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isIncome ? '+' : '-'}{currency}{Number(act.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {new Date(act.timestamp).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: CREATE GOAL ======================= */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>Create Savings Goal</span>
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, New Laptop"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900"
                >
                  {GOAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Target Amount ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="3000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Initial Saved ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="500"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: DEPOSIT FUNDS ======================= */}
      {isDepositModalOpen && selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-sm p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                <span>Deposit to Goal</span>
              </h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white">{selectedGoalForDeposit.title}</span>
              <p className="text-slate-400 mt-0.5">
                Current: {currency}{selectedGoalForDeposit.currentAmount.toLocaleString()} / Target: {currency}{selectedGoalForDeposit.targetAmount.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleDepositToGoal} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Amount to Deposit ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  placeholder="e.g. 250"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-base font-bold text-emerald-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: ADD NOTE ======================= */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <StickyNote className="w-5 h-5 text-indigo-400" />
                <span>Add Financial Note</span>
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tax Deadline, Renewal check"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Tag</label>
                  <select
                    value={newNote.tag}
                    onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900"
                  >
                    {NOTE_TAGS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Card Accent</label>
                  <select
                    value={newNote.color}
                    onChange={(e) => setNewNote({ ...newNote, color: e.target.value })}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm bg-slate-900"
                  >
                    <option value="indigo">Indigo Accent</option>
                    <option value="emerald">Emerald Accent</option>
                    <option value="amber">Amber Accent</option>
                    <option value="rose">Rose Accent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Content / Memo</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your financial reminder or rule details..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={newNote.pinned}
                  onChange={(e) => setNewNote({ ...newNote, pinned: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <label htmlFor="pinNote" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Pin this memo to top of board
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsAndNotes;
