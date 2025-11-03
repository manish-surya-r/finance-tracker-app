export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string format
  notes: string;
}

export interface Category {
  value: string;
  label: string;
}

export type Budgets = {
  [category: string]: number;
};
