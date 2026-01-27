import React from "react";
import { MoreVertical } from "lucide-react";

export default function StatCard({ title, value, trend, positive, icon, iconBg = "bg-gray-100", iconFg = "text-gray-500" }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 transition-shadow duration-150">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBg}`}>
              {React.isValidElement(icon) ? React.cloneElement(icon, { className: iconFg, size: 16 }) : icon}
            </div>
          )}
          <p className="text-sm text-gray-500">{title}</p>
        </div>

        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="flex items-end justify-between mt-3">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {trend}
          </span>

          {/* action moved to top-right */}
        </div>
      </div>
    </div>
  );
}
