import { configureStore, combineReducers } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import budgetsReducer from './budgetsSlice';

const APP_STATE_KEY = 'financeTrackerState';

// Create a root reducer to infer the RootState type
const rootReducer = combineReducers({
  transactions: transactionsReducer,
  budgets: budgetsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Utility functions for localStorage
const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem(APP_STATE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    // Assume the stored state matches the RootState shape
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(APP_STATE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;