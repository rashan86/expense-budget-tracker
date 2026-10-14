import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeVsExpenseChart = ({ transactions = [], currency = '$' }) => {
  // Group transactions by date (Month/Year or last 6 entries)
  const monthlyData = {};

  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    const monthKey = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthlyData[monthKey].income += tx.amount;
    } else {
      monthlyData[monthKey].expense += tx.amount;
    }
  });

  const labels = Object.keys(monthlyData).reverse();
  const incomeData = labels.map((key) => monthlyData[key].income);
  const expenseData = labels.map((key) => monthlyData[key].expense);

  if (labels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="text-sm font-medium">No transaction data available for comparison</p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        hoverBackgroundColor: '#10B981',
        borderColor: '#34D399',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        hoverBackgroundColor: '#F43F5E',
        borderColor: '#FB7185',
        borderWidth: 1,
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94A3B8',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: 600,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${context.dataset.label}: ${currency}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)', strokeDash: [4, 4] },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (val) => `${currency}${val.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeVsExpenseChart;
