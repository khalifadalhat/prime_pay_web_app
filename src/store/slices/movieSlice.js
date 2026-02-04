import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://mflix-movies.onrender.com/api';

// ===================== ASYNC THUNKS (API CALLS) =====================

// Fetch all movies (READ)
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new movie (CREATE)
export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create movie');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update existing movie (UPDATE)
export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update movie');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete movie (DELETE)
export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }
      
      return movieId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== INITIAL STATE =====================

const initialState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovies: [],
  currentPage: 1,
  itemsPerPage: 9,
};

// ===================== SLICE =====================

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Toggle individual movie selection
    toggleMovieSelection: (state, action) => {
      const movieId = action.payload;
      if (state.selectedMovies.includes(movieId)) {
        state.selectedMovies = state.selectedMovies.filter(id => id !== movieId);
      } else {
        state.selectedMovies.push(movieId);
      }
    },
    
    // Set multiple selected movies
    setSelectedMovies: (state, action) => {
      state.selectedMovies = action.payload;
    },
    
    // Clear all selections
    clearMovieSelection: (state) => {
      state.selectedMovies = [];
    },
    
    // Set current page
    setMovieCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      state.selectedMovies = []; // Clear selection when changing pages
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH MOVIES ==========
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch movies';
      })
      
      // ========== CREATE MOVIE ==========
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.unshift(action.payload); // Add to beginning
        state.error = null;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create movie';
      })
      
      // ========== UPDATE MOVIE ==========
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movies.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update movie';
      })
      
      // ========== DELETE MOVIE ==========
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = state.movies.filter(m => m._id !== action.payload);
        state.selectedMovies = state.selectedMovies.filter(id => id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete movie';
      });
  },
});

// ===================== ACTIONS =====================

export const {
  toggleMovieSelection,
  setSelectedMovies,
  clearMovieSelection,
  setMovieCurrentPage,
} = movieSlice.actions;

// ===================== SELECTORS =====================

export const selectMoviesLoading = (state) => state.movies.loading;
export const selectMoviesError = (state) => state.movies.error;
export const selectSelectedMovies = (state) => state.movies.selectedMovies;
export const selectMovieCurrentPage = (state) => state.movies.currentPage;

// Select paginated movies for current page
export const selectPaginatedMovies = (state) => {
  const { movies, currentPage, itemsPerPage } = state.movies;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return movies.slice(startIndex, endIndex);
};

// Select total pages
export const selectMovieTotalPages = (state) => {
  const { movies, itemsPerPage } = state.movies;
  return Math.ceil(movies.length / itemsPerPage);
};

// Select movie statistics
export const selectMovieStats = (state) => {
  const { movies } = state.movies;
  const currentYear = new Date().getFullYear();
  
  return {
    totalMovies: movies.length,
    recentMovies: movies.filter(m => m.year >= currentYear - 5).length,
    highRated: movies.filter(m => m.imdb?.rating >= 7).length,
    totalGenres: [...new Set(movies.flatMap(m => m.genres || []))].length,
  };
};

// Select pagination info
export const selectMoviePaginationInfo = (state) => {
  const { movies, currentPage, itemsPerPage } = state.movies;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, movies.length);
  
  return {
    startIndex,
    endIndex,
    totalItems: movies.length,
  };
};

export default movieSlice.reducer;