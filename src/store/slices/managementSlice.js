import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMovies, createMovie, updateMovie, deleteMovie } from '../../services/managementApi';

const ITEMS_PER_PAGE = 10;

export const loadMovies = createAsyncThunk('management/loadMovies', async () => {
  return await fetchMovies();
});

export const addMovie = createAsyncThunk('management/addMovie', async (movieData) => {
  return await createMovie(movieData);
});

export const editMovie = createAsyncThunk('management/editMovie', async ({ id, data }) => {
  return await updateMovie(id, data);
});

export const removeMovie = createAsyncThunk('management/removeMovie', async (id) => {
  await deleteMovie(id);
  return id;
});

const managementSlice = createSlice({
  name: 'management',
  initialState: {
    movies: [],
    selectedMovies: [],
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    toggleMovieSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedMovies.indexOf(id);
      if (index > -1) {
        state.selectedMovies.splice(index, 1);
      } else {
        state.selectedMovies.push(id);
      }
    },
    setSelectedMovies: (state, action) => {
      state.selectedMovies = action.payload;
    },
    clearMovieSelection: (state) => {
      state.selectedMovies = [];
    },
    setMovieCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadMovies.fulfilled, (state, action) => {
        // Normalize API response to an array of movies.
        // Many APIs return { movies: [...] } or { data: [...] } or an array directly.
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.movies = payload;
        } else if (payload?.movies && Array.isArray(payload.movies)) {
          state.movies = payload.movies;
        } else if (payload?.data && Array.isArray(payload.data)) {
          state.movies = payload.data;
        } else {
          state.movies = []; // fallback
        }
        state.loading = false;
      })
      .addCase(loadMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload);
      })
      .addCase(editMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) state.movies[index] = action.payload;
      })
      .addCase(removeMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((m) => m._id !== action.payload);
      });
  },
});

// Export actions
export const { toggleMovieSelection, setSelectedMovies, clearMovieSelection, setMovieCurrentPage } = managementSlice.actions;

// Selectors
export const selectPaginatedMovies = (state) => {
  const movies = Array.isArray(state.management.movies) ? state.management.movies : [];
  const startIndex = (state.management.currentPage - 1) * ITEMS_PER_PAGE;
  return movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
};

export const selectMoviesLoading = (state) => state.management.loading;
export const selectMoviesError = (state) => state.management.error;
export const selectSelectedMovies = (state) => state.management.selectedMovies;
export const selectMovieCurrentPage = (state) => state.management.currentPage;

export const selectMovieTotalPages = (state) => {
  return Math.ceil(state.management.movies.length / ITEMS_PER_PAGE);
};

export const selectMovieStats = (state) => {
  const movies = state.management.movies;
  const currentYear = new Date().getFullYear();
  return {
    totalMovies: movies.length,
    recentMovies: movies.filter((m) => m.year >= currentYear - 5).length,
    highRated: movies.filter((m) => m.imdb?.rating >= 7).length,
    totalGenres: new Set(movies.flatMap((m) => m.genres || [])).size,
  };
};

export const selectMoviePaginationInfo = (state) => {
  const startIndex = (state.management.currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(state.management.currentPage * ITEMS_PER_PAGE, state.management.movies.length);
  return {
    startIndex,
    endIndex,
    totalItems: state.management.movies.length,
  };
};

export default managementSlice.reducer;