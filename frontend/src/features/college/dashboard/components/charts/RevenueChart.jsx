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

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-lg ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-200"
    }`}>
      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
        ₹{payload[0].value.toLocaleString()}{" "}
        <span className={`font-normal ${darkMode ? "text-gray-400" : "text-gray-500"}`}>revenue</span>
      </p>
    </div>
  );
};

const RevenueChart = ({ data, darkMode }) => {
  const chartData =
    data?.monthlyRevenue?.length > 0 ? data.monthlyRevenue : defaultData;

  return (
    <ChartWrapper
      darkMode={darkMode}
      title="Revenue Analytics"
      subtitle="Monthly revenue trends"
      badge="Last 6 months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#E5E7EB"} vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fill: darkMode ? "#808080" : "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />

          <YAxis
            tick={{ fill: darkMode ? "#808080" : "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip
            content={<CustomTooltip darkMode={darkMode} />}
            cursor={{ stroke: "#00bea3", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#00bea3"
            strokeWidth={3}
            dot={{ r: 4, fill: "#00bea3", stroke: darkMode ? "#2D2D2D" : "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#00bea3", stroke: darkMode ? "#2D2D2D" : "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default RevenueChart;
