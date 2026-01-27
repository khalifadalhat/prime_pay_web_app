import StatCard from "../components/StatCard";
import RevenueChart from "../charts/RevenueChart";
import CardItem from "../components/CardItem";
import { Search, Bell, Mail, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Wallet, CircleDollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 px-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Financial Dashboard</h2>
            <p className="text-sm text-gray-500">Hey welcome back, Eleanor 👋</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                placeholder="Search anything here..."
                className="border rounded-full px-4 py-2 pl-10 w-80 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100">
              <Mail size={18} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">E</div>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: left = stats + chart, right = My Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: stats stacked above chart (major area) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Total Balance"
              value="$82,620"
              trend="+8% to last month"
              positive
              icon={<Wallet />}
              iconBg="bg-blue-100"
              iconFg="text-blue-600"
            />
            <StatCard
              title="Total Spending"
              value="$54,870"
              trend="-2% to last month"
              icon={<CircleDollarSign />}
              iconBg="bg-yellow-100"
              iconFg="text-yellow-600"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg flex-1 flex flex-col transition-shadow duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Monitoring Overview</h3>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  <span>Earnings</span>
                  <span className="w-2 h-2 rounded-full bg-pink-200 inline-block ml-2" />
                  <span>Expenses</span>
                </div>
              </div>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>Monthly</option>
              </select>
            </div>

            <div className="flex-1 min-h-[260px]">
              <RevenueChart />
            </div>
          </div>
        </div>

        {/* RIGHT: My Cards (stretches to match chart height) */}
        <div className="lg:col-span-4 flex">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg w-full flex flex-col transition-shadow duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">My Cards</h3>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">Add New Card</button>
            </div>

            <div className="space-y-3 flex-1">
              <CardItem currency="Euro" balance="€ 28,572.00" status="Active" type="Master Card" brand="Master Card" logo="mastercard" last4="2870" />
              <CardItem currency="US Dollar" balance="$ 12,148.00" status="Disabled" type="Credit Card" brand="VISA" logo="visa" last4="2870" />
              <CardItem currency="Canada Dollar" balance="$ 58,629.00" status="Disabled" type="Business Card" brand="AMAZON" logo="amazon" last4="2870" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-12 bg-white rounded-2xl border border-gray-100 shadow-md p-6 transition-shadow duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Transaction</h3>
          <div className="flex items-center gap-2">
            <input placeholder="Search..." className="border rounded-full px-3 py-1 text-sm" />
            <button className="px-3 py-1 border rounded-md text-sm">Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span>Deal ID</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ChevronsUpDown size={14} />
                    </button>
                  </div>
                </th>

                <th className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span>Customer Name</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ChevronsUpDown size={14} />
                    </button>
                  </div>
                </th>

                <th className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span>Customer Email</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ChevronsUpDown size={14} />
                    </button>
                  </div>
                </th>

                <th className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span>Date</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ChevronsUpDown size={14} />
                    </button>
                  </div>
                </th>

                <th className="text-left p-3">
                  <div className="flex items-center gap-2">
                    <span>Amount</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ChevronsUpDown size={14} />
                    </button>
                  </div>
                </th>

                <th className="text-left p-3">Deal Stage</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">DE254839</td>
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">E</div>
                  Esther Howard
                </td>
                <td className="p-3">howard@gmail.com</td>
                <td className="p-3">28 Dec 2025</td>
                <td className="p-3">$ 582,479.00</td>
                <td className="p-3">
                  <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700">Success</span>
                </td>
                <td className="p-3">⋮</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">DE254840</td>
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">K</div>
                  Kristin Watson
                </td>
                <td className="p-3">watson@gmail.com</td>
                <td className="p-3">14 Feb 2025</td>
                <td className="p-3">$ 235,241.00</td>
                <td className="p-3">
                  <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                </td>
                <td className="p-3">⋮</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
