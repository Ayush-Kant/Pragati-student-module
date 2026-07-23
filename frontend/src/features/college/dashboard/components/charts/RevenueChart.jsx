import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartWrapper from "./ChartWrapper";

const defaultData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 72000 },
  { month: "Apr", revenue: 81000 },
  { month: "May", revenue: 93000 },
  { month: "Jun", revenue: 105000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">
        ₹{payload[0].value.toLocaleString()}{" "}
        <span className="font-normal text-gray-500">revenue</span>
      </p>
    </div>
  );
};

const RevenueChart = ({ data }) => {
  const chartData =
    data?.monthlyRevenue?.length > 0 ? data.monthlyRevenue : defaultData;

  return (
    <ChartWrapper
      title="Revenue Analytics"
      subtitle="Monthly revenue trends"
      badge="Last 6 months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />

          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#93C5FD", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default RevenueChart;
