import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://randomuser.me/api/', {
        params: { results: 50 },
      });
      const data = response.data;

      // Transform the API data
      const transformedUsers = data.results.map((user, index) => {
        const userNum = 1000 + index;
        const fullAddress = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`;

        return {
          id: `#USR${userNum}`,
          gender: user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          address: fullAddress,
          city: user.location.city,
          country: user.location.country,
          phone: user.phone,
          registeredDate: new Date(user.registered.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          picture: user.picture.thumbnail,
        };
      });

      return transformedUsers;
    } catch (error) {
      console.error('Fetch users error:', error);
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

// Thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      // Simulated API call
      // const response = await fetch(`/api/users/${userId}`, { 
      //   method: 'DELETE' 
      // });
      // if (!response.ok) throw new Error('Delete failed');

      // For now, just return the userId to remove it from state
      return userId;
    } catch (error) {
      console.error('Delete user error:', error);
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

// Thunk for updating a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Simulated API call
      // const response = await fetch(`/api/users/${userData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // if (!response.ok) throw new Error('Update failed');
      // const updatedUser = await response.json();

      // For now, just return the updated user data
      return userData;
    } catch (error) {
      console.error('Update user error:', error);
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    selectedUsers: [],
    currentPage: 1,
    itemsPerPage: 9,
  },
  reducers: {
    // Toggle individual user selection
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },

    // Select all users (pass array of user IDs)
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },

    // Clear all selections
    clearSelection: (state) => {
      state.selectedUsers = [];
    },

    // Set current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      state.selectedUsers = []; // Clear selection when changing pages
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete user';
      })

      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update user';
      });
  },
});

// Export actions
export const {
  toggleUserSelection,
  setSelectedUsers,
  clearSelection,
  setCurrentPage,
  clearError,
} = usersSlice.actions;

// Basic selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectSelectedUsers = (state) => state.users.selectedUsers;
export const selectCurrentPage = (state) => state.users.currentPage;
export const selectItemsPerPage = (state) => state.users.itemsPerPage;

// Computed selectors
export const selectPaginatedUsers = (state) => {
  const users = selectAllUsers(state);
  const currentPage = selectCurrentPage(state);
  const itemsPerPage = selectItemsPerPage(state);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return users.slice(startIndex, endIndex);
};

export const selectTotalPages = (state) => {
  const users = selectAllUsers(state);
  const itemsPerPage = selectItemsPerPage(state);
  return Math.ceil(users.length / itemsPerPage);
};

export const selectUserStats = (state) => {
  const users = selectAllUsers(state);
  const now = new Date();

  return {
    totalUsers: users.length,
    maleUsers: users.filter(u => u.gender === 'Male').length,
    femaleUsers: users.filter(u => u.gender === 'Female').length,
    registeredThisMonth: users.filter(u => {
      const regDate = new Date(u.registeredDate);
      return regDate.getMonth() === now.getMonth() &&
        regDate.getFullYear() === now.getFullYear();
    }).length,
  };
};

export const selectPaginationInfo = (state) => {
  const users = selectAllUsers(state);
  const currentPage = selectCurrentPage(state);
  const itemsPerPage = selectItemsPerPage(state);
  const totalPages = selectTotalPages(state);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, users.length),
    totalItems: users.length,
    totalPages,
  };
};

export default usersSlice.reducer;