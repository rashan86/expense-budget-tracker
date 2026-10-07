import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import ProtectedRoutes from './components/ProtectedRoutes';
import Navbar from './components/Navbar';
import TransactionModal from './components/TransactionModal';
import BudgetModal from './components/BudgetModal';
import ExportModal from './components/ExportModal';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';

const AppLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const { addTransaction, updateTransaction, setBudgetLimit, exportCSV, exportPDF } = useFinance();

  // Modal States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenTransactionModal = (txToEdit = null) => {
    setEditingTransaction(txToEdit);
    setIsTransactionModalOpen(true);
  };

  const handleOpenBudgetModal = (budgetToEdit = null) => {
    setEditingBudget(budgetToEdit);
    setIsBudgetModalOpen(true);
  };

  const handleSaveTransaction = async (data) => {
    if (editingTransaction) {
      return await updateTransaction(editingTransaction._id, data);
    } else {
      return await addTransaction(data);
    }
  };

  const handleSaveBudget = async (data) => {
    return await setBudgetLimit(data);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {isAuthenticated && <Navbar onOpenTransactionModal={() => handleOpenTransactionModal()} />}

      <main className={isAuthenticated ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route
              path="/"
              element={
                <Dashboard
                  onOpenTransactionModal={handleOpenTransactionModal}
                  onOpenBudgetModal={handleOpenBudgetModal}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onEditTransaction={(tx) => handleOpenTransactionModal(tx)}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <Transactions
                  onOpenTransactionModal={handleOpenTransactionModal}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onEditTransaction={(tx) => handleOpenTransactionModal(tx)}
                />
              }
            />
            <Route
              path="/budgets"
              element={
                <Budgets onOpenBudgetModal={(b) => handleOpenBudgetModal(b)} />
              }
            />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      {isAuthenticated && (
        <>
          <TransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            onSubmit={handleSaveTransaction}
            initialData={editingTransaction}
            currency={user?.currency || '$'}
          />

          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            onSubmit={handleSaveBudget}
            initialData={editingBudget}
            currency={user?.currency || '$'}
          />

          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExportCSV={exportCSV}
            onExportPDF={exportPDF}
          />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <FinanceProvider>
          <AppLayout />
        </FinanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
