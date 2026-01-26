import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Goal,
  Settings,
  Mail,
  CircleDollarSign,
  MessageCircleQuestionMark,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${
      isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-72 bg-white border-r p-6 min-h-screen flex flex-col justify-between">
      <div>
        {/* Brand card */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">PP</div>
            <div>
              <h1 className="text-lg font-bold">Prime Pay</h1>
              <p className="text-xs text-gray-500">Finance App</p>
            </div>
          </div>
        </div>

        {/* Menu card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-gray-500 font-semibold mb-3">Menu</div>
          <nav className="space-y-1">
            <NavLink to="/" className={linkClass}>
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600"><LayoutDashboard size={16} /></div>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/users" className={linkClass}>
              <Users size={18} />
              <span>User Management</span>
            </NavLink>

            <NavLink to="/transaction" className={linkClass}>
              <FileText size={18} />
              <span>Transaction</span>
            </NavLink>

            <NavLink to="/autopay" className={linkClass}>
              <Clock size={18} />
              <span>Auto Pay</span>
            </NavLink>

            <NavLink to="/goals" className={linkClass}>
              <Goal size={18} />
              <span>Goals</span>
            </NavLink>

            <NavLink to="/settings" className={linkClass}>
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>

            <NavLink to="/message" className={linkClass}>
              <div className="relative">
                <Mail size={18} />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">2</span>
              </div>
              <span>Message</span>
            </NavLink>

            <NavLink to="/investment" className={linkClass}>
              <CircleDollarSign size={18} />
              <span>Investment</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        <div className="ml-4 border-t pt-4 space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <MessageCircleQuestionMark size={18} />
            Support
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">
            <LogOut size={18} />
            Log out
          </button>

          <div className="bg-gradient-to-br from-pink-100 to-white border rounded-2xl p-4 mt-4">
            <div className="text-sm font-semibold mb-2">PRO</div>
            <p className="text-xs text-gray-600 mb-3">Reminders exits projects, advanced searching and more</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm">Upgrade Pro</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
