export default function StatCard({ title, value, trend, positive }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-end justify-between mt-3">
        <h3 className="text-2xl font-bold">{value}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            positive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
