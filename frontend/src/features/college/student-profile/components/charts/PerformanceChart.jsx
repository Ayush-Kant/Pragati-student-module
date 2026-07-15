import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-lg">
      <p className="text-xs font-semibold text-gray-500">Semester {label}</p>
      <p className="text-sm font-bold text-indigo-600">
        SGPA: <span className="text-gray-900">{payload[0].value.toFixed(2)}</span>
      </p>
    </div>
  );
};

export const PerformanceChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    semester: item.semester,
    sgpa: parseFloat(item.sgpa)
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">SGPA Trend</h3>
        <p className="text-xs text-gray-400">Semester-wise academic score trajectory</p>
      </div>
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No semester data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="semester"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sgpa"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
