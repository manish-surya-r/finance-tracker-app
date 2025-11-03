
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ScaleIcon } from './Icons';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

const ICONS = {
    income: <ArrowUpIcon className="h-8 w-8 text-green-500" />,
    expense: <ArrowDownIcon className="h-8 w-8 text-red-500" />,
    balance: <ScaleIcon className="h-8 w-8 text-blue-500" />
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const amountColor = type === 'income' ? 'text-green-600 dark:text-green-400' :
                      type === 'expense' ? 'text-red-600 dark:text-red-400' :
                      amount >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
                      
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className={`text-xl sm:text-2xl font-bold ${amountColor}`}>{formattedAmount}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
        {ICONS[type]}
      </div>
    </div>
  );
};

export default SummaryCard;
