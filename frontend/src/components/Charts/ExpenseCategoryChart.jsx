import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseCategoryChart = ({ transactions = [], currency = '$' }) => {
  // Aggregate expenses by category
  const expenseMap = {};
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount;
    }
  });

  const categories = Object.keys(expenseMap);
  const amounts = Object.values(expenseMap);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="text-sm font-medium">No expense records found to generate chart</p>
      </div>
    );
  }

  const colors = [
    '#F43F5E', // Rose
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: '#0F172A',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94A3B8',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: 600,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const total = amounts.reduce((a, b) => a + b, 0);
            const percentage = ((val / total) * 100).toFixed(1);
            return ` ${currency}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 w-full relative">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpenseCategoryChart;
