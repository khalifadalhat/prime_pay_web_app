import { Plus, Download, Edit2, Trash2, ChevronsUpDown, Clock, FileText, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";

const orders = [
  {
    id: "#ORD1008",
    name: "Esther Kiehn",
    date: "17 Dec 2024",
    status: "Pending",
    amount: "$10.50",
    payment: "Unpaid",
  },
  {
    id: "#ORD1007",
    name: "Denise Kuhn",
    date: "16 Dec 2024",
    status: "Pending",
    amount: "$100.50",
    payment: "Unpaid",
  },
  {
    id: "#ORD1006",
    name: "Clint Hoppe",
    date: "16 Dec 2024",
    status: "Completed",
    amount: "$60.56",
    payment: "Paid",
  },
  {
    id: "#ORD1005",
    name: "Darin Deckow",
    date: "16 Dec 2024",
    status: "Refunded",
    amount: "$640.50",
    payment: "Paid",
  },
  {
    id: "#ORD1004",
    name: "Jacquelyn Robel",
    date: "15 Dec 2024",
    status: "Completed",
    amount: "$39.50",
    payment: "Paid",
  },
  {
    id: "#ORD1003",
    name: "Clint Hoppe",
    date: "16 Dec 2024",
    status: "Completed",
    amount: "$29.50",
    payment: "Paid",
  },
  {
    id: "#ORD1002",
    name: "Erin Bins",
    date: "16 Dec 2024",
    status: "Completed",
    amount: "$120.35",
    payment: "Paid",
  },
  {
    id: "#ORD1001",
    name: "Gretchen Quitz",
    date: "14 Dec 2024",
    status: "Refunded",
    amount: "$123.50",
    payment: "Paid",
  },
  {
    id: "#ORD1000",
    name: "Stewart Kulas",
    date: "13 Dec 2024",
    status: "Completed",
    amount: "$89.99",
    payment: "Paid",
  },
];

export default function Users() {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const allSelected = selected.length === orders.length;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900">All Orders</h2>

        <div className="flex gap-3">
          <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
            <Clock size={16} />
            Bulk Update Status
          </button>
          <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm flex gap-2 items-center hover:bg-gray-50">
            <FileText size={16} />
            Export Orders
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-gray-800">
            <Plus size={16} />
            Add Orders
          </button>
        </div>
      </div>

      {/* Summary cards with colored indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-150">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-600">Total Orders This Month</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">200</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-150">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">20</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-150">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600">Shipped Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">180</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-150">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <p className="text-sm text-gray-600">Refunded Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">10</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b text-sm">
        {["All", "Incomplete", "Overdue", "Ongoing", "Finished"].map((t) => (
          <button
            key={t}
            className={`pb-3 font-medium transition ${
              t === "All"
                ? "border-b-2 border-blue-600 text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-x-auto relative">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    allSelected
                      ? setSelected([])
                      : setSelected(orders.map((o) => o.id))
                  }
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Order Number
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Customer Name
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Order Date
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Status
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Total Amount
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  Payment Status
                  <ChevronsUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th className="p-4 text-left text-gray-600 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => {
              const isSel = selected.includes(o.id);
              return (
                <tr
                  key={o.id}
                  className={`border-t border-gray-100 ${
                    isSel ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-4 align-middle">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(o.id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="p-4 align-middle text-gray-700 font-medium">{o.id}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs text-white font-bold">
                        {getInitials(o.name)}
                      </div>
                      <div className="text-sm text-gray-700">{o.name}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-gray-600">{o.date}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        o.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : o.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-gray-700 font-medium">{o.amount}</td>
                  <td className="p-4 align-middle text-gray-600">{o.payment}</td>
                  <td className="p-4 align-middle text-gray-500 flex items-center gap-2">
                    <button className="text-gray-500 hover:text-gray-700 p-1">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Bulk action toolbar */}
        {selected.length > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">
              {selected.length} Selected
            </div>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50">
              Duplicate
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50">
              Print
            </button>
            <button className="px-3 py-1 border border-red-200 rounded-md text-sm text-red-600 hover:bg-red-50">
              Delete
            </button>
            <button className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}

        {/* Footer with pagination */}
        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600 border-t border-gray-100">
          <div>
            Showing <span className="font-semibold text-gray-900">1-9</span> of{" "}
            <span className="font-semibold text-gray-900">240</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-1">
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white font-medium">
                1
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded-full hover:bg-gray-50">
                2
              </button>
              <button className="w-8 h-8 border border-gray-200 rounded-full hover:bg-gray-50">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-8 h-8 border border-gray-200 rounded-full hover:bg-gray-50">
                12
              </button>
            </div>
            <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-1">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
