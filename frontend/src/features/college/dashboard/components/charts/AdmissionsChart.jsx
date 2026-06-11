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

const admissionsData = [
  { month: "Jan", admissions: 120 },
  { month: "Feb", admissions: 145 },
  { month: "Mar", admissions: 180 },
  { month: "Apr", admissions: 220 },
  { month: "May", admissions: 260 },
  { month: "Jun", admissions: 300 },
];


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">
        {payload[0].value.toLocaleString()}{" "}
        <span className="font-normal text-gray-500">admissions</span>
      </p>
    </div>
  );
};

const AdmissionsChart = () => {
  return (
    <ChartWrapper
      title="Admissions Analytics"
      subtitle="Monthly admission trends"
      badge="Last 6 months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={admissionsData}
          margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id="admissionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />

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
            width={48}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#93C5FD",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          <Area
            type="monotone"
            dataKey="admissions"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#admissionsGradient)"
            dot={{ r: 3, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default AdmissionsChart;
