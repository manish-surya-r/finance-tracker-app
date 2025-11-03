import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import SummaryCard from './SummaryCard';
import CategoryPieChart from './CategoryPieChart';
import TrendLineChart from './TrendLineChart';
import BudgetStatus from './BudgetStatus';
import BudgetModal from './BudgetModal';
import { SparklesIcon, CogIcon } from './Icons';
import { getSpendingInsights } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ totalIncome, totalExpenses, balance }) => {
  const transactions = useSelector((state: RootState) => state.transactions.items);
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleGetInsights = useCallback(async () => {
    setIsLoadingInsights(true);
    setInsights('');
    const result = await getSpendingInsights(transactions);
    setInsights(result);
    setIsLoadingInsights(false);
  }, [transactions]);
  
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <SummaryCard title="Total Income" amount={totalIncome} type="income" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
        <SummaryCard title="Balance" amount={balance} type="balance" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Monthly Budget Status</h3>
            <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                <CogIcon className="h-5 w-5" />
                Set Budgets
            </button>
        </div>
        <BudgetStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-80 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 text-center">Expense Breakdown</h3>
            <CategoryPieChart transactions={transactions} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-80 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expense Trend</h3>
            <TrendLineChart transactions={transactions} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-xl font-bold">AI Financial Insights</h3>
          <button
            onClick={handleGetInsights}
            disabled={isLoadingInsights || transactions.length === 0}
            className="mt-2 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="h-5 w-5" />
            {isLoadingInsights ? 'Generating...' : 'Get Insights'}
          </button>
        </div>
        {isLoadingInsights && <div className="text-center p-4">Loading insights...</div>}
        {insights && (
           <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        )}
        {!insights && !isLoadingInsights && <p className="text-gray-500 dark:text-gray-400">Click the button to get personalized financial advice based on your transactions.</p>}
      </div>
      {isBudgetModalOpen && <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />}
    </section>
  );
};

export default Dashboard;
