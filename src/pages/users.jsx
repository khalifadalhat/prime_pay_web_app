import { Plus, Download, Edit2, Trash2, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";
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
  fetchUsers,
  deleteUser,
  updateUser,
  toggleUserSelection,
  setSelectedUsers,
  clearSelection,
  setCurrentPage,
  selectPaginatedUsers,
  selectUsersLoading,
  selectUsersError,
  selectSelectedUsers,
  selectCurrentPage,
  selectTotalPages,
  selectUserStats,
  selectPaginationInfo,
} from "../store/slices/usersSlice";

export default function Users() {
  const dispatch = useDispatch();
  
  // Select data from Redux store using selectors
  const currentOrders = useSelector(selectPaginatedUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const selected = useSelector(selectSelectedUsers);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const stats = useSelector(selectUserStats);
  const paginationInfo = useSelector(selectPaginationInfo);

  // Local state for edit dialog
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Toggle individual user selection
  const toggle = (id) => {
    dispatch(toggleUserSelection(id));
  };

  // Check if all users on current page are selected
  const allSelected = selected.length === currentOrders.length && currentOrders.length > 0;

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(setSelectedUsers(currentOrders.map((o) => o.id)));
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Handle delete user
  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    selected.forEach(userId => {
      dispatch(deleteUser(userId));
    });
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  // Handle save edited user
  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const updatedUser = {
      ...editingUser,
      name: formData.get('name'),
      gender: formData.get('gender'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    };
    
    dispatch(updateUser(updatedUser));
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Handle retry on error
  const handleRetry = () => {
    dispatch(fetchUsers());
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
        <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Bulk Actions
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Summary cards with colored indicators */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Male Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.maleUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-pink-500">
          <p className="text-sm text-gray-600 mb-1">Female Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.femaleUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Registered This Month</p>
          <p className="text-3xl font-bold text-gray-900">{stats.registeredThisMonth}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b">
        {["All", "Male", "Female", "Recently Registered", "Active"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 font-medium ${
              t === "All"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t}
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
                User ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Gender
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentOrders.map((o) => {
              const isSel = selected.includes(o.id);
              return (
                <tr
                  key={o.id}
                  className={`hover:bg-gray-50 ${isSel ? "bg-blue-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(o.id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{o.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {o.picture ? (
                        <img
                          src={o.picture}
                          alt={o.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {getInitials(o.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{o.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      o.gender === 'Male' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {o.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{o.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate" title={o.address}>
                    {o.address}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{o.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* EDIT USER */}
                      <button 
                        onClick={() => handleEditUser(o)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* DELETE USER */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete user {o.id} ({o.name})?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(o.id)}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleSaveUser}>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    User ID
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser.id}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser.name}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue={editingUser.gender}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingUser.phone}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    defaultValue={editingUser.address}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
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
              Print
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
            onClick={() => dispatch(clearSelection())}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer with pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of{" "}
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