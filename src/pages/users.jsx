import { Plus, Download, Edit2, Trash2, ChevronsUpDown, Clock, FileText, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
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
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from "../store/slices/usersSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { data: users = [], loading, error } = useSelector((state) => state.users);

  
  const [localUsers, setLocalUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentTab, setCurrentTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    dispatch(loadUsers(30)); // fetch 30 random users
  }, [dispatch]);

  // retry helper for centered error UI
  const handleRetry = () => {
    dispatch(loadUsers(30));
  };
  
  // when users arrive from redux, initialize localUsers (so UI operations are local-only)
  useEffect(() => {
    if (Array.isArray(users)) {
      setLocalUsers(users);
      setSelected([]);
      setCurrentPage(1);
    }
  }, [users]);

  // helpers
  const uid = (u, idx) => u?.login?.uuid ?? u?.email ?? idx;
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "";

  // selection
  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const allSelected = selected.length === localUsers.length && localUsers.length > 0;
  const toggleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(localUsers.map((u, i) => uid(u, i)));
  };

  // edit
  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nameTitle: user?.name?.title ?? "",
      first: user?.name?.first ?? "",
      last: user?.name?.last ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? user?.cell ?? "",
      gender: user?.gender ?? "",
      city: user?.location?.city ?? "",
      state: user?.location?.state ?? "",
      country: user?.location?.country ?? "",
      postcode: user?.location?.postcode ?? "",
    });
    setIsEditOpen(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const id = uid(editingUser);
    setLocalUsers((list) =>
      list.map((u) =>
        uid(u) === id
          ? {
              ...u,
              name: { title: formData.nameTitle, first: formData.first, last: formData.last },
              email: formData.email,
              phone: formData.phone,
              cell: formData.phone,
              gender: formData.gender,
              location: {
                ...u.location,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                postcode: formData.postcode,
              },
            }
          : u
      )
    );
    setIsEditOpen(false);
    setEditingUser(null);
  };

  // delete
  const deleteUser = (id) => {
    setLocalUsers((list) => list.filter((u, i) => uid(u, i) !== id));
    setSelected((s) => s.filter((x) => x !== id));
  };

  const bulkDelete = () => {
    setLocalUsers((list) => list.filter((u, i) => !selected.includes(uid(u, i))));
    setSelected([]);
  };

  // pagination
  const totalPages = Math.max(1, Math.ceil(localUsers.length / pageSize));
  const paginated = localUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // stats for summary cards
  const total = localUsers.length;
  const male = localUsers.filter((u) => u.gender === "male").length;
  const female = localUsers.filter((u) => u.gender === "female").length;
  const uniqueNats = new Set(localUsers.map((u) => u.nat).filter(Boolean)).size;

  if (loading && localUsers.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && localUsers.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Bulk Actions
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Dialog open={false}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-1">Male</p>
          <p className="text-3xl font-bold text-gray-900">{male}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600 mb-1">Female</p>
          <p className="text-3xl font-bold text-gray-900">{female}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Nat. Count</p>
          <p className="text-3xl font-bold text-gray-900">{uniqueNats}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b">
        {["All", "Male", "Female", "Top Nats"].map((t) => (
          <button
            key={t}
            onClick={() => setCurrentTab(t)}
            className={`px-4 py-2 font-medium ${t === currentTab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"}`}
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
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nat</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginated.map((u, idx) => {
              const id = uid(u, idx + (currentPage - 1) * pageSize);
              const name = u?.name ? `${u.name.title} ${u.name.first} ${u.name.last}`.trim() : "N/A";
              const picture = u?.picture?.thumbnail ?? u?.picture?.medium ?? "";
              const street = u?.location?.street ? `${u.location.street.number ?? ""} ${u.location.street.name ?? ""}`.trim() : "";
              const address = u?.location ? [street, u.location.city, u.location.state, u.location.country, u.location.postcode].filter(Boolean).join(", ") : "N/A";
              const isSel = selected.includes(id);

              return (
                <tr key={id} className={`hover:bg-gray-50 ${isSel ? "bg-blue-50" : ""}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={isSel} onChange={() => toggle(id)} className="w-4 h-4 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {picture ? (
                        <img src={picture} alt={name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">{getInitials(name)}</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{u?.location?.city}, {u?.location?.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.gender}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-gray-600">{u.phone ?? u.cell}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{address}</td>
                  <td className="px-6 py-4 text-gray-600">{u?.dob?.age ?? "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{u.nat}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-2 hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>

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
                              Are you sure you want to delete "{name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteUser(id)} className="bg-red-600 hover:bg-red-700">
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={saveEdit}>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input value={formData.nameTitle} onChange={(e) => setFormData({ ...formData, nameTitle: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input value={formData.first} onChange={(e) => setFormData({ ...formData, first: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <input value={formData.last} onChange={(e) => setFormData({ ...formData, last: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <input placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                  <input placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
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
            <button onClick={() => { /* duplicate not implemented */ }} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
              <FileText className="w-4 h-4 inline mr-2" />
              Duplicate
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button onClick={bulkDelete} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
          <button onClick={() => setSelected([])} className="ml-4 text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Footer with pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {(localUsers.length === 0) ? 0 : ( (currentPage - 1) * pageSize + 1)}-{Math.min(currentPage * pageSize, localUsers.length)} of <span className="font-semibold">{localUsers.length}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}>{pageNum}</button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 py-2">...</span>
                <button onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 rounded-lg border hover:bg-gray-50">{totalPages}</button>
              </>
            )}
          </div>
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
