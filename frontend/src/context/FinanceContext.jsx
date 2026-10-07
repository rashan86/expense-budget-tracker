import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  
  const [budgetsData, setBudgetsData] = useState({
    budgets: [],
    totalBudgeted: 0,
    totalSpent: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    category: 'All',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch transactions with current filters
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'All') params.append('type', filters.type.toLowerCase());
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page);
      params.append('limit', filters.limit);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const res = await api.get(`/transactions?${params.toString()}`);
      if (res.data.success) {
        setTransactions(res.data.data.transactions);
        setPagination(res.data.data.pagination);
        setSummary(res.data.data.summary);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  // Fetch budget limits & progress
  const fetchBudgets = useCallback(async (month, year) => {
    if (!isAuthenticated) return;
    try {
      const m = month || budgetsData.month;
      const y = year || budgetsData.year;
      const res = await api.get(`/budgets?month=${m}&year=${y}`);
      if (res.data.success) {
        setBudgetsData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  }, [isAuthenticated, budgetsData.month, budgetsData.year]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchBudgets();
    }
  }, [isAuthenticated, fetchTransactions, fetchBudgets]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 if filter fields change (except page change itself)
      page: newFilters.page !== undefined ? newFilters.page : (newFilters.limit !== undefined ? prev.page : 1),
    }));
  };

  const addTransaction = async (data) => {
    try {
      const res = await api.post('/transactions', data);
      if (res.data.success) {
        await fetchTransactions();
        await fetchBudgets();
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to add transaction' };
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const res = await api.put(`/transactions/${id}`, data);
      if (res.data.success) {
        await fetchTransactions();
        await fetchBudgets();
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update transaction' };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        await fetchTransactions();
        await fetchBudgets();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete transaction' };
    }
  };

  const setBudgetLimit = async (data) => {
    try {
      const res = await api.post('/budgets', data);
      if (res.data.success) {
        await fetchBudgets(data.month, data.year);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to set budget limit' };
    }
  };

  const deleteBudgetLimit = async (id) => {
    try {
      const res = await api.delete(`/budgets/${id}`);
      if (res.data.success) {
        await fetchBudgets();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete budget' };
    }
  };

  const exportCSV = async (overrideFilters = {}) => {
    try {
      const f = { ...filters, ...overrideFilters };
      const params = new URLSearchParams();
      if (f.type && f.type !== 'All') params.append('type', f.type.toLowerCase());
      if (f.category && f.category !== 'All') params.append('category', f.category);
      if (f.startDate) params.append('startDate', f.startDate);
      if (f.endDate) params.append('endDate', f.endDate);

      const response = await api.get(`/transactions/export/csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (err) {
      console.error('Export CSV failed:', err);
      return { success: false, error: 'CSV export failed' };
    }
  };

  const exportPDF = async (overrideFilters = {}) => {
    try {
      const f = { ...filters, ...overrideFilters };
      const params = new URLSearchParams();
      if (f.type && f.type !== 'All') params.append('type', f.type.toLowerCase());
      if (f.category && f.category !== 'All') params.append('category', f.category);
      if (f.startDate) params.append('startDate', f.startDate);
      if (f.endDate) params.append('endDate', f.endDate);

      const response = await api.get(`/transactions/export/pdf?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (err) {
      console.error('Export PDF failed:', err);
      return { success: false, error: 'PDF export failed' };
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        pagination,
        summary,
        budgetsData,
        loading,
        filters,
        updateFilters,
        fetchTransactions,
        fetchBudgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudgetLimit,
        deleteBudgetLimit,
        exportCSV,
        exportPDF,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
