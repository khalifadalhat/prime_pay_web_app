import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import moviesReducer from './slices/movieSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    movies: moviesReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});