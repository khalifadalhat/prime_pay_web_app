import { Plus, Download, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import SummaryCard from "../components/SummaryCard";
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
];

export default function Users() {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const allSelected = selected.length === orders.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Orders</h2>

        <div className="flex gap-3">
          <button className="border px-4 py-2 rounded-lg text-sm">
            Bulk Update Status
          </button>
          <button className="border px-4 py-2 rounded-lg text-sm flex gap-2">
            <Download size={16} /> Export Orders
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg flex gap-2">
            <Plus size={16} /> Add Orders
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Orders This Month" value="200" />
        <SummaryCard title="Pending Orders" value="20" />
        <SummaryCard title="Shipped Orders" value="180" />
        <SummaryCard title="Refunded Orders" value="10" />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b text-sm">
        {["All", "Incomplete", "Overdue", "Ongoing", "Finished"].map((t) => (
          <button
            key={t}
            className={`pb-3 ${
              t === "All"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto relative">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => (allSelected ? setSelected([]) : setSelected(orders.map((o) => o.id)))}
                  className="w-4 h-4"
                />
              </th>
              <th className="p-4 text-left">Order Number</th>
              <th className="p-4 text-left">Customer Name</th>
              <th className="p-4 text-left">Order Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total Amount</th>
              <th className="p-4 text-left">Payment Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => {
              const isSel = selected.includes(o.id);
              return (
                <tr key={o.id} className={`border-t ${isSel ? 'bg-gray-50' : ''}`}>
                  <td className="p-4 align-top">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(o.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-4 align-top text-gray-700">{o.id}</td>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                        {o.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <div className="text-sm text-gray-700">{o.name}</div>
                    </div>
                  </td>
                  <td className="p-4 align-top text-gray-500">{o.date}</td>
                  <td className="p-4 align-top">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-4 align-top text-gray-700">{o.amount}</td>
                  <td className="p-4 align-top text-gray-500">{o.payment}</td>
                  <td className="p-4 align-top text-gray-500 flex items-center gap-3">
                    <button className="text-gray-500 hover:text-gray-700"><Edit2 size={16} /></button>
                    <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    <div>⋮</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Bulk action toolbar */}
        {selected.length > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 bg-white border rounded-xl shadow-md px-4 py-2 flex items-center gap-4">
            <div className="text-sm text-gray-700">{selected.length} Selected</div>
            <button className="px-3 py-1 border rounded-md text-sm">Duplicate</button>
            <button className="px-3 py-1 border rounded-md text-sm">Print</button>
            <button className="px-3 py-1 border rounded-md text-sm text-red-600">Delete</button>
          </div>
        )}

        {/* Footer with range + pagination */}
        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500 border-t">
          <div>Showing <span className="font-semibold text-gray-800">1-9</span> of <span className="font-semibold text-gray-800">240</span> entries</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md">Previous</button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white">1</button>
              <button className="w-8 h-8 border rounded-full">2</button>
              <button className="w-8 h-8 border rounded-full">3</button>
              <div className="px-3">...</div>
              <button className="w-8 h-8 border rounded-full">12</button>
            </div>
            <button className="px-3 py-1 border rounded-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
