import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../types';

interface TransactionsState {
  items: Transaction[];
}

const initialState: TransactionsState = {
  items: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTransaction: Transaction = {
        ...action.payload,
        id: new Date().getTime().toString(),
      };
      state.items.unshift(newTransaction);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;