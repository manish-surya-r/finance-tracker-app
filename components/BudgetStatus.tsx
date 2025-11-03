import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { TransactionType } from '../types';

const BudgetProgressBar: React.FC<{ spent: number; budget: number }> = ({ spent, budget }) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  
  let barColor = 'bg-primary-500'; // Green
  if (percentage > 100) {
    barColor = 'bg-red-500'; // Red
  } else if (percentage >= 75) {
    barColor = 'bg-yellow-500'; // Yellow
  }

  const formattedSpent = spent.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedBudget = budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{formattedSpent}</span>
        <span className="text-gray-500 dark:text-gray-400">of {formattedBudget}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`${barColor} h-2.5 rounded-full`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}>
        </div>
      </div>
    </div>
  );
};

const BudgetStatus: React.FC = () => {
  const { budgets, transactions } = useSelector((state: RootState) => ({
    budgets: state.budgets.items,
    transactions: state.transactions.items,
  }));

  const monthlyExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses: { [category: string]: number } = {};

    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const transactionDate = new Date(t.date);
        if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          expenses[t.category] = (expenses[t.category] || 0) + t.amount;
        }
      });
    return expenses;
  }, [transactions]);

  const budgetedCategories = Object.entries(budgets)
    .filter(([, budgetAmount]) => budgetAmount > 0)
    .sort(([catA], [catB]) => catA.localeCompare(catB));

  if (budgetedCategories.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-4">No budgets set. Click 'Set Budgets' to get started.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgetedCategories.map(([category, budgetAmount]) => {
        const spent = monthlyExpenses[category] || 0;
        return (
          <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold mb-2 capitalize">{category}</h4>
            <BudgetProgressBar spent={spent} budget={budgetAmount} />
          </div>
        );
      })}
    </div>
  );
};

export default BudgetStatus;
