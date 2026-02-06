import { Plus, Download, Edit2, Trash2, Clock, FileText, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  loadMovies,
  toggleMovieSelection,
  setSelectedMovies,
  setMovieCurrentPage,
  selectPaginatedMovies,
  selectMoviesLoading,
  selectMoviesError,
  selectSelectedMovies,
  selectMovieCurrentPage,
  selectMovieTotalPages,
  selectMovieStats,
  selectMoviePaginationInfo,
  clearMovieSelection,
} from "../store/slices/managementSlice";

export default function Management() {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const allMovies = useSelector((state) => state.management.movies);
  const loading = useSelector(selectMoviesLoading);
  const error = useSelector(selectMoviesError);
  const selected = useSelector(selectSelectedMovies);
  const currentPage = useSelector(selectMovieCurrentPage);

  // Local state for movies (to add/edit/delete locally without API)
  const [localMovies, setLocalMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [formData, setFormData] = useState({ title: '', year: '', rating: '', plot: '', genres: '', directors: '', cast: '', runtime: '' });

  const pageSize = 10;

  // Initialize localMovies from Redux on mount
  useEffect(() => {
    dispatch(loadMovies());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allMovies)) {
      setLocalMovies(allMovies);
    }
  }, [allMovies]);

  // Pagination
  // Filter movies based on active tab
  const getFilteredMovies = () => {
    const currentYear = new Date().getFullYear();
    switch (activeTab) {
      case "Recent":
        return localMovies.filter((m) => m.year >= currentYear - 5);
      case "High Rated":
        return localMovies.filter((m) => m.imdb?.rating >= 7);
      case "Classics":
        return localMovies.filter((m) => m.year < 2000);
      case "Action":
        return localMovies.filter((m) => 
          m.genres?.some(g => g.toLowerCase().includes("action"))
        );
      case "All":
      default:
        return localMovies;
    }
  };

  const filteredMovies = getFilteredMovies();
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
  const currentMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Stats
  const stats = {
    totalMovies: localMovies.length,
    recentMovies: localMovies.filter((m) => m.year >= new Date().getFullYear() - 5).length,
    highRated: localMovies.filter((m) => m.imdb?.rating >= 7).length,
    totalGenres: new Set(localMovies.flatMap((m) => m.genres || [])).size,
  };

  const paginationInfo = {
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, localMovies.length),
    totalItems: filteredMovies.length,
  };

  // Handlers
  const toggle = (id) => {
    dispatch(toggleMovieSelection(id));
  };

  const allSelected = selected.length === currentMovies.length && currentMovies.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearMovieSelection());
    } else {
      dispatch(setSelectedMovies(currentMovies.map((m) => m._id)));
    }
  };

  const handlePageChange = (page) => {
    dispatch(setMovieCurrentPage(page));
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a title');
      return;
    }

    const newMovie = {
      _id: `temp_${Date.now()}`, // temporary ID
      title: formData.title,
      plot: formData.plot,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      year: parseInt(formData.year) || new Date().getFullYear(),
      runtime: parseInt(formData.runtime) || 0,
      directors: formData.directors.split(',').map(d => d.trim()).filter(Boolean),
      cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean),
      imdb: {
        rating: parseFloat(formData.rating) || 0,
      },
    };

    setLocalMovies([newMovie, ...localMovies]);
    setIsAddDialogOpen(false);
    setFormData({ title: '', year: '', rating: '', plot: '', genres: '', directors: '', cast: '', runtime: '' });
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      plot: movie.plot || '',
      year: movie.year || '',
      runtime: movie.runtime || '',
      genres: movie.genres?.join(', ') || '',
      directors: movie.directors?.join(', ') || '',
      cast: movie.cast?.join(', ') || '',
      rating: movie.imdb?.rating || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a title');
      return;
    }

    const updatedMovie = {
      ...editingMovie,
      title: formData.title,
      plot: formData.plot,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      year: parseInt(formData.year),
      runtime: parseInt(formData.runtime),
      directors: formData.directors.split(',').map(d => d.trim()).filter(Boolean),
      cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean),
      imdb: {
        rating: parseFloat(formData.rating) || 0,
      },
    };

    setLocalMovies(localMovies.map((m) => (m._id === editingMovie._id ? updatedMovie : m)));
    setIsEditDialogOpen(false);
    setEditingMovie(null);
    setFormData({ title: '', year: '', rating: '', plot: '', genres: '', directors: '', cast: '', runtime: '' });
  };

  const handleDelete = (movieId) => {
    setLocalMovies(localMovies.filter((m) => m._id !== movieId));
  };

  const handleBulkDelete = () => {
    setLocalMovies(localMovies.filter((m) => !selected.includes(m._id)));
    dispatch(clearMovieSelection());
  };

  const handleRetry = () => {
    dispatch(loadMovies());
  };

  // Loading state
  if (loading && localMovies.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && localMovies.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Movie Management</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Bulk Actions
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Movies
          </button>
          
          {/* ADD MOVIE DIALOG */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Movie
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Movie</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMovie}>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="The Shawshank Redemption"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plot *</label>
                    <textarea
                      name="plot"
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                      placeholder="Enter movie plot..."
                      value={formData.plot || ''}
                      onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Year *</label>
                      <input
                        name="year"
                        type="number"
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="1994"
                        min="1900"
                        max="2100"
                        value={formData.year || ''}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Runtime (minutes) *</label>
                      <input
                        name="runtime"
                        type="number"
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="142"
                        min="1"
                        value={formData.runtime || ''}
                        onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Genres (comma-separated) *</label>
                    <input
                      name="genres"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Drama, Crime"
                      value={formData.genres || ''}
                      onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Directors (comma-separated) *</label>
                    <input
                      name="directors"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Frank Darabont"
                      value={formData.directors || ''}
                      onChange={(e) => setFormData({ ...formData, directors: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cast (comma-separated) *</label>
                    <input
                      name="cast"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Tim Robbins, Morgan Freeman"
                      value={formData.cast || ''}
                      onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IMDb Rating</label>
                    <input
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="9.3"
                      value={formData.rating || ''}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setFormData({ title: '', year: '', rating: '', plot: '', genres: '', directors: '', cast: '', runtime: '' });
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Movie
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary cards with colored indicators */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Movies</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMovies}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Recent (5 years)</p>
          <p className="text-3xl font-bold text-gray-900">{stats.recentMovies}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">High Rated (7+)</p>
          <p className="text-3xl font-bold text-gray-900">{stats.highRated}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Total Genres</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalGenres}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b">
        {["All", "Recent", "High Rated", "Classics", "Action"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              dispatch(setMovieCurrentPage(1));
            }}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Year
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Genre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Director
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Runtime
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentMovies.map((movie) => {
              const isSel = selected.includes(movie._id);
              return (
                <tr
                  key={movie._id}
                  className={`hover:bg-gray-50 ${isSel ? "bg-blue-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(movie._id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{movie.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{movie.plot}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{movie.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres?.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {movie.directors?.[0] || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">
                        {movie.imdb?.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* EDIT MOVIE */}
                      <button 
                        onClick={() => handleEditMovie(movie)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* DELETE MOVIE */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{movie.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(movie._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
          </DialogHeader>
          {editingMovie && (
            <form onSubmit={handleSaveMovie}>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Plot</label>
                  <textarea
                    name="plot"
                    value={formData.plot || ''}
                    onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <input
                      name="year"
                      type="number"
                      value={formData.year || ''}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Runtime</label>
                    <input
                      name="runtime"
                      type="number"
                      value={formData.runtime || ''}
                      onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Genres (comma-separated)</label>
                  <input
                    name="genres"
                    type="text"
                    value={formData.genres || ''}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Directors (comma-separated)</label>
                  <input
                    name="directors"
                    type="text"
                    value={formData.directors || ''}
                    onChange={(e) => setFormData({ ...formData, directors: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cast (comma-separated)</label>
                  <input
                    name="cast"
                    type="text"
                    value={formData.cast || ''}
                    onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IMDb Rating</label>
                  <input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk action toolbar */}
      {selected.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4">
          <span className="font-medium">{selected.length} Selected</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
              <FileText className="w-4 h-4 inline mr-2" />
              Duplicate
            </button>
            <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
          <button
            onClick={() => dispatch(clearMovieSelection())}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer with pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredMovies.length === 0 ? 0 : paginationInfo.startIndex}-{paginationInfo.endIndex} of{" "}
          <span className="font-semibold">{paginationInfo.totalItems}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-1">
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 py-2">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 rounded-lg border hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}