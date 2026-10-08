import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  PiggyBank, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      navigate('/');
    } else {
      setError(res?.error || 'Failed to login');
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Left Visual Banner Section */}
      <div className="lg:w-1/2 bg-hero-auth p-8 lg:p-16 flex flex-col justify-between relative min-h-[380px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-800/80">
        <div className="relative z-10">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-3 bg-slate-900/80 border border-slate-700/80 px-4 py-2 rounded-2xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              FinancePulse
            </span>
          </div>

          <div className="mt-12 max-w-lg space-y-4">
            <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Master Your Money with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Precision & Ease</span>
            </h1>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
              Track income, manage category budgets, visualize expense analytics, and export financial statements in seconds.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-3 relative z-10 mt-8">
          <div className="glass-card p-3.5 rounded-2xl border border-slate-700/50">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" />
            <h4 className="text-xs font-bold text-white">Live Insights</h4>
            <p className="text-[10px] text-slate-400">Cashflow & summary</p>
          </div>
          <div className="glass-card p-3.5 rounded-2xl border border-slate-700/50">
            <PiggyBank className="w-5 h-5 text-amber-400 mb-1" />
            <h4 className="text-xs font-bold text-white">Smart Budgets</h4>
            <p className="text-[10px] text-slate-400">Alerts & limits</p>
          </div>
          <div className="glass-card p-3.5 rounded-2xl border border-slate-700/50">
            <BarChart3 className="w-5 h-5 text-indigo-400 mb-1" />
            <h4 className="text-xs font-bold text-white">Reports</h4>
            <p className="text-[10px] text-slate-400">CSV & PDF export</p>
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Account</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access your financial dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Box */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Demo Account</span>
            </p>
            <button
              type="button"
              onClick={() => handleFillDemo('john@example.com', 'password123')}
              className="w-full py-2.5 px-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 font-medium transition-colors flex items-center justify-between"
            >
              <span>Demo User: john@example.com</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Auto Fill</span>
            </button>
          </div>

          {/* Register Redirect */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
