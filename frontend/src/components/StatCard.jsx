import React from 'react';

const StatCard = ({ title, amount, currency = '$', icon: Icon, type = 'neutral', subtitle, progress }) => {
  const getColors = () => {
    switch (type) {
      case 'income':
        return {
          bg: 'from-emerald-500/10 to-emerald-500/5',
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          text: 'text-emerald-400',
          glow: 'glow-emerald',
        };
      case 'expense':
        return {
          bg: 'from-rose-500/10 to-rose-500/5',
          border: 'border-rose-500/20 hover:border-rose-500/40',
          iconBg: 'bg-rose-500/20 text-rose-400',
          text: 'text-rose-400',
          glow: 'glow-rose',
        };
      case 'balance':
        return {
          bg: 'from-blue-500/10 to-indigo-500/5',
          border: 'border-blue-500/20 hover:border-blue-500/40',
          iconBg: 'bg-blue-500/20 text-blue-400',
          text: 'text-blue-400',
          glow: 'glow-indigo',
        };
      case 'warning':
        return {
          bg: 'from-amber-500/10 to-amber-500/5',
          border: 'border-amber-500/20 hover:border-amber-500/40',
          iconBg: 'bg-amber-500/20 text-amber-400',
          text: 'text-amber-400',
          glow: '',
        };
      default:
        return {
          bg: 'from-slate-800/40 to-slate-900/40',
          border: 'border-slate-700/40 hover:border-slate-600/40',
          iconBg: 'bg-slate-700/50 text-slate-300',
          text: 'text-slate-200',
          glow: '',
        };
    }
  };

  const style = getColors();

  const formattedAmount = typeof amount === 'number'
    ? `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : amount;

  const getAmbientGlow = () => {
    switch (type) {
      case 'income':
        return 'chart-watermark-glow-emerald';
      case 'expense':
        return 'chart-watermark-glow-rose';
      case 'warning':
        return 'chart-watermark-glow-amber';
      case 'balance':
      default:
        return 'chart-watermark-glow-indigo';
    }
  };

  return (
    <div
      className={`crystal-card p-6 rounded-2xl border ${style.border} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group shadow-xl`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">
            {title}
          </p>
          <h3 className={`text-2xl lg:text-3xl font-extrabold ${style.text} tracking-tight`}>
            {formattedAmount}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${style.iconBg} shadow-inner group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-400">Monthly Budget Target</span>
            <span className={style.text}>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress >= 100
                  ? 'bg-rose-500'
                  : progress >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
