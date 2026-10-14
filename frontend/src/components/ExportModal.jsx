import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Eye,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

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
  const [exportedPdf, setExportedPdf] = useState(null);

  // Reset states when modal is closed or opened
  useEffect(() => {
    if (!isOpen) {
      setExportedPdf(null);
      setSuccessMessage(null);
      setErrorMessage(null);
      setLoadingType(null);
    }
  }, [isOpen]);

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
        setExportedPdf({ url: res.url, fileName: res.fileName });
        setSuccessMessage(`PDF generated successfully and saved to your Downloads folder!`);
      } else {
        setErrorMessage(res?.error || 'PDF export failed');
      }
    } catch (err) {
      setLoadingType(null);
      setErrorMessage(err.message || 'PDF export failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="crystal-card w-full max-w-lg rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-400" />
            <span>{exportedPdf ? 'Financial PDF Report Preview' : 'Export Financial Reports'}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode 1: PDF Successfully Generated & Ready to View */}
        {exportedPdf ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-emerald-300 text-sm">PDF Report Ready & Saved!</p>
                <p className="text-slate-300">
                  File name: <span className="font-mono text-white font-semibold">{exportedPdf.fileName}</span>
                </p>
                <p className="text-slate-400 flex items-center space-x-1">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Location: Saved automatically in your PC's <strong>Downloads</strong> folder</span>
                </p>
              </div>
            </div>

            {/* Embedded Live PDF Document Iframe */}
            <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
              <div className="bg-slate-800/90 px-3.5 py-2 border-b border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Document View (User: Rashan)</span>
                </span>
                <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-200 font-mono">100% Generated</span>
              </div>
              <iframe
                src={exportedPdf.url}
                title="PDF Document Preview"
                className="w-full h-80 bg-white"
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={exportedPdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all text-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </a>

              <a
                href={exportedPdf.url}
                download={exportedPdf.fileName}
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all text-center"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Again</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setExportedPdf(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back to Export Filters
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          /* View Mode 2: Export Filter Configuration */
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
        )}
      </div>
    </div>
  );
};

export default ExportModal;
