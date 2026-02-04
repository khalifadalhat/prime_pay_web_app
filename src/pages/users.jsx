import { Plus, Download, Edit2, Trash2, ChevronsUpDown, Clock, FileText, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function Users() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch data from RandomUser API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://randomuser.me/api/?results=50');
        const data = await response.json();
        
        // Transform the API data to include gender, name, email, and address
        const transformedOrders = data.results.map((user, index) => {
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
              year: 'numeric'
            }),
            picture: user.picture.thumbnail,
          };
        });
        
        setOrders(transformedOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const allSelected = selected.length === orders.length && orders.length > 0;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Calculate statistics
  const totalUsers = orders.length;
  const maleUsers = orders.filter(o => o.gender === 'Male').length;
  const femaleUsers = orders.filter(o => o.gender === 'Female').length;
  const registeredThisMonth = orders.filter(o => {
    const regDate = new Date(o.registeredDate);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelected([]); // Clear selection when changing pages
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
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
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Male Users</p>
          <p className="text-3xl font-bold text-gray-900">{maleUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-pink-500">
          <p className="text-sm text-gray-600 mb-1">Female Users</p>
          <p className="text-3xl font-bold text-gray-900">{femaleUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Registered This Month</p>
          <p className="text-3xl font-bold text-gray-900">{registeredThisMonth}</p>
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
                  onChange={() =>
                    allSelected ? setSelected([]) : setSelected(currentOrders.map((o) => o.id))
                  }
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              // Handle save logic here
                            }}
                          >
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  User ID
                                </label>
                                <input
                                  type="text"
                                  defaultValue={o.id}
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
                                  defaultValue={o.name}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Gender
                                </label>
                                <select
                                  defaultValue={o.gender}
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
                                  defaultValue={o.email}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  defaultValue={o.phone}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Address
                                </label>
                                <textarea
                                  defaultValue={o.address}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  rows="3"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </DialogTrigger>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

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
                              onClick={() => {
                                // Handle delete logic here
                                console.log("Deleting user:", o.id);
                              }}
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
            <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
          <button
            onClick={() => setSelected([])}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer with pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of{" "}
          <span className="font-semibold">{orders.length}</span> entries
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