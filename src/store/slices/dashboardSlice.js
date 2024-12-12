import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budget: null,
  monthlyIncome: null,
  expenses: 2505.67,
  budgetUsedPercentage: 75.5,
  recentTransactions: [  ],
  userProfile: {
    userName: '',
    email: ''
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setBudgetData: (state, action) => {
      state.budget = action.payload;
    },
    setIncomeData: (state, action) => {
      state.monthlyIncome = action.payload;
    },
    updateExpenses: (state, action) => {
      state.expenses = action.payload;
      if (state.budget) {
        state.budgetUsedPercentage = (state.expenses / state.budget) * 100;
      }
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    addTransaction: (state, action) => {
      state.recentTransactions.unshift(action.payload);
      if (state.recentTransactions.length > 4) {
        state.recentTransactions.pop();
      }
      // Updating expenses
      const newExpenses = state.expenses + action.payload.amount;
      state.expenses = newExpenses;
      if (state.budget) {
        state.budgetUsedPercentage = (newExpenses / state.budget) * 100;
      }
    }
  }
});

export const {
  setBudgetData,
  setIncomeData,
  updateExpenses,
  setUserProfile,
  addTransaction
} = dashboardSlice.actions;

export default dashboardSlice.reducer;