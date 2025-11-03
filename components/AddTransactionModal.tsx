import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../store/transactionsSlice';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { XIcon } from './Icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const dispatch = useDispatch();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const isEditing = !!transactionToEdit;
  const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(String(transactionToEdit.amount));
      setCategory(transactionToEdit.category);
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setNotes(transactionToEdit.notes);
    } else {
      // Reset form on open for new transaction
      setType(TransactionType.EXPENSE);
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [transactionToEdit, isOpen]);
  
  useEffect(() => {
      setCategory('');
  }, [type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert('Please fill in all required fields.');
      return;
    }
    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes,
    };
    if (isEditing) {
      dispatch(updateTransaction({ ...transactionData, id: transactionToEdit.id }));
    } else {
      dispatch(addTransaction(transactionData));
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit' : 'Add'} Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`flex-1 py-2 px-4 rounded-l-md ${type === TransactionType.EXPENSE ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} transition-colors`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`flex-1 py-2 px-4 rounded-r-md ${type === TransactionType.INCOME ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} transition-colors`}
              >
                Income
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0.00"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Coffee with a friend"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">{isEditing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
