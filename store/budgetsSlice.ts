import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Budgets } from '../types';

interface BudgetsState {
  items: Budgets;
}

const initialState: BudgetsState = {
  items: {},
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budgets>) => {
      state.items = action.payload;
    },
  },
});

export const { setBudgets } = budgetsSlice.actions;

export default budgetsSlice.reducer;