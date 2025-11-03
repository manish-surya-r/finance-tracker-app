
import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FFD5', '#1954FF'];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const expenseData = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryTotals: { [key: string]: number } = {};

    expenseData.forEach(t => {
      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] = t.amount;
      }
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No expense data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
