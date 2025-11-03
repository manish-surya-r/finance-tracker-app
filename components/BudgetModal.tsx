import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBudgets } from '../store/budgetsSlice';
import type { RootState } from '../store/store';
import type { Budgets } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { XIcon } from './Icons';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentBudgets = useSelector((state: RootState) => state.budgets.items);
  const [localBudgets, setLocalBudgets] = useState<Budgets>({});

  useEffect(() => {
    if (isOpen) {
      setLocalBudgets(currentBudgets);
    }
  }, [isOpen, currentBudgets]);

  const handleBudgetChange = (category: string, value: string) => {
    const amount = parseFloat(value);
    setLocalBudgets(prev => ({
      ...prev,
      [category]: isNaN(amount) ? 0 : amount,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setBudgets(localBudgets));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Set Monthly Budgets</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {EXPENSE_CATEGORIES.map(cat => (
              <div key={cat.value}>
                <label htmlFor={`budget-${cat.value}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{cat.label}</label>
                <input
                  type="number"
                  id={`budget-${cat.value}`}
                  value={localBudgets[cat.value] || ''}
                  onChange={e => handleBudgetChange(cat.value, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">Save Budgets</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
