import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartWrapper from "./ChartWrapper";

const defaultData = [
  { month: "Jan", admissions: 120 },
  { month: "Feb", admissions: 145 },
  { month: "Mar", admissions: 180 },
  { month: "Apr", admissions: 220 },
  { month: "May", admissions: 260 },
  { month: "Jun", admissions: 300 },
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
        <span className={`font-normal ${darkMode ? "text-gray-400" : "text-gray-500"}`}>admissions</span>
      </p>
    </div>
  );
};

const AdmissionsChart = ({ data, darkMode }) => {
  const chartData =
    data?.admissionsTrend?.length > 0 ? data.admissionsTrend : defaultData;

  return (
    <ChartWrapper
      darkMode={darkMode}
      title="Admissions Analytics"
      subtitle="Monthly admission trends"
      badge="Last 6 months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="admissionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6d34" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#ff6d34" stopOpacity={0} />
            </linearGradient>
          </defs>

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
            cursor={{ stroke: "#ff6d34", strokeWidth: 1, strokeDasharray: "4 4" }}
          />

          <Area
            type="monotone"
            dataKey="admissions"
            stroke="#ff6d34"
            strokeWidth={2.5}
            fill="url(#admissionsGradient)"
            dot={{ r: 3, fill: "#ff6d34", strokeWidth: 2, stroke: darkMode ? "#2D2D2D" : "#fff" }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: darkMode ? "#2D2D2D" : "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default AdmissionsChart;
