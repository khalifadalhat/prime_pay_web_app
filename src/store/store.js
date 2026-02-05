import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import managementReducer from './slices/managementSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    management: managementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});