import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, Calendar, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
  'Business',
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

const ExportModal = ({ isOpen, onClose, onExportCSV, onExportPDF }) => {
  const [filter, setFilter] = useState({
    type: 'All',
    category: 'All',
    startDate: '',
    endDate: '',
  });

  const [loadingType, setLoadingType] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleExportCSV = async () => {
    try {
      setLoadingType('csv');
      setErrorMessage(null);
      const res = await onExportCSV(filter);
      setLoadingType(null);
      if (res?.success) {
        setSuccessMessage('CSV spreadsheet downloaded to your Downloads folder!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 2000);
      } else {
        setErrorMessage(res?.error || 'CSV export failed');
      }
    } catch (err) {
      setLoadingType(null);
      setErrorMessage(err.message || 'CSV export failed');
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoadingType('pdf');
      setErrorMessage(null);
      const res = await onExportPDF(filter);
      setLoadingType(null);
      if (res?.success) {
        setSuccessMessage('PDF report downloaded to your Downloads folder!');
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 2000);
      } else {
        setErrorMessage(res?.error || 'PDF export failed');
      }
    } catch (err) {
      setLoadingType(null);
      setErrorMessage(err.message || 'PDF export failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-400" />
            <span>Export Financial Reports</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Filter Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Income', 'Expense'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter({ ...filter, type: t })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    filter.type === t
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium bg-[#0F172A]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          {/* Notifications */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Download Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleExportCSV}
              disabled={loadingType !== null}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{loadingType === 'csv' ? 'Generating CSV...' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={loadingType !== null}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600/30 text-rose-400 font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{loadingType === 'pdf' ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500 pt-1">
            📁 Exported files automatically save into your browser's <span className="text-slate-300 font-medium">Downloads</span> folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
