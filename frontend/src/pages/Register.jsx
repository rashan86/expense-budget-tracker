import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User as UserIcon, Mail, Lock, DollarSign, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CURRENCY_OPTIONS = [
  { symbol: '$', name: 'USD ($)' },
  { symbol: '€', name: 'EUR (€)' },
  { symbol: '£', name: 'GBP (£)' },
  { symbol: '₹', name: 'INR (₹)' },
  { symbol: 'LKR', name: 'LKR (Rs)' },
  { symbol: 'A$', name: 'AUD (A$)' },
  { symbol: 'C$', name: 'CAD (C$)' },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('$');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);
    const res = await register(name, email, password, currency);
    setLoading(false);

    if (res?.success) {
      navigate('/');
    } else {
      setError(res?.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Left Visual Banner Section */}
      <div className="lg:w-1/2 bg-hero-auth p-8 lg:p-16 flex flex-col justify-between relative min-h-[380px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-800/80">
        <div className="relative z-10">
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
              Start Your Financial Journey <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Today</span>
            </h1>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
              Create your account in under 30 seconds. Get full access to income & expense tracking, category budgets, and PDF report downloads.
            </p>
          </div>
        </div>

        <div className="space-y-3 relative z-10 mt-8">
          <div className="flex items-center space-x-3 text-slate-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-currency support with custom preferences</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Interactive Chart.js visual financial analytics</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Protected JWT authentication security</span>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Free Account</h2>
            <p className="text-xs text-slate-400">Join FinancePulse and take control of your money</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Preferred Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Preferred Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-[#070A11]"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center space-x-2 pt-2"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
