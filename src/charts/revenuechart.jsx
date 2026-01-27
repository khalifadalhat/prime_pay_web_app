import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", earning: 22000, expense: 30000 },
  { month: "Feb", earning: 34000, expense: 26000 },
  { month: "Mar", earning: 28000, expense: 32000 },
  { month: "Apr", earning: 40000, expense: 30000 },
  { month: "May", earning: 50000, expense: 35000 },
  { month: "Jun", earning: 30000, expense: 28000 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="earning" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line dataKey="expense" stroke="#fca5a5" strokeDasharray="5 5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
