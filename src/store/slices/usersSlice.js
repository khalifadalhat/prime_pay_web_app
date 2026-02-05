import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRandomUsers } from '../../services/randomUserApi';

export const loadUsers = createAsyncThunk('users/loadUsers', async (count = 10) => {
  return await fetchRandomUsers(count);
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;