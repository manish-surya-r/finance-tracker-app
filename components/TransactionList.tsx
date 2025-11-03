import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../store/transactionsSlice';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import { PencilIcon, TrashIcon, DownloadIcon } from './Icons';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

const TransactionListItem: React.FC<{
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}> = ({ transaction, onEdit }) => {
  const dispatch = useDispatch();
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const sign = isIncome ? '+' : '-';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(transaction.id));
    }
  };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 transition-shadow hover:shadow-lg">
      <div className="flex-1 mb-4 sm:mb-0">
        <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold ${amountColor}`}>{sign}${transaction.amount.toFixed(2)}</span>
            <div>
                <p className="font-semibold capitalize">{transaction.category}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
        </div>
        {transaction.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-12">{transaction.notes}</p>}
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <button onClick={() => onEdit(transaction)} className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <PencilIcon className="h-5 w-5" />
        </button>
        <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit }) => {

  const downloadCSV = () => {
    const headers = "ID,Type,Amount,Category,Date,Notes\n";
    const csvContent = transactions.map(t => 
      `${t.id},${t.type},${t.amount},${t.category},${t.date},"${t.notes.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        {transactions.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            Download CSV
          </button>
        )}
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 p-8 bg-white dark:bg-gray-800 rounded-lg">No transactions yet. Add one to get started!</p>
      ) : (
        <ul>
          {transactions.map(t => (
            <TransactionListItem key={t.id} transaction={t} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default TransactionList;
