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
  { month: "Jan", placements: 25 },
  { month: "Feb", placements: 30 },
  { month: "Mar", placements: 38 },
  { month: "Apr", placements: 44 },
  { month: "May", placements: 52 },
  { month: "Jun", placements: 61 },
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
        {payload[0].value.toLocaleString()}{" "}
        <span className={`font-normal ${darkMode ? "text-gray-400" : "text-gray-500"}`}>students placed</span>
      </p>
    </div>
  );
};

const PlacementChart = ({ data, darkMode }) => {
  // Backend returns placementTrends as [{ name, placements }]
  // We normalise it to [{ month, placements }] for the chart
  const rawTrends = data?.placementTrends;
  const chartData =
    rawTrends?.length > 0
      ? rawTrends.map((d) => ({ month: d.name ?? d.month, placements: d.placements }))
      : defaultData;

  return (
    <ChartWrapper
      darkMode={darkMode}
      title="Placement Analytics"
      subtitle="Student placement growth over time"
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
            width={48}
          />

          <Tooltip
            content={<CustomTooltip darkMode={darkMode} />}
            cursor={{ stroke: "#00bea3", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Line
            type="monotone"
            dataKey="placements"
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

export default PlacementChart;
