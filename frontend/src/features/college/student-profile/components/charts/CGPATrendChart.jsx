import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-lg">
      <p className="text-xs font-semibold text-gray-500">Semester {label}</p>
      <div className="space-y-1 mt-1 text-xs">
        <p className="text-indigo-600 font-medium">
          SGPA: <span className="font-bold text-gray-800">{payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-emerald-600 font-medium">
          CGPA: <span className="font-bold text-gray-800">{payload[1].value.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export const CGPATrendChart = ({ data = [] }) => {
  // Compute cumulative CGPA trend
  let runningSum = 0;
  const chartData = data.map((item, index) => {
    const sgpaVal = parseFloat(item.sgpa);
    runningSum += sgpaVal;
    const cgpaVal = runningSum / (index + 1);
    return {
      semester: item.semester,
      SGPA: sgpaVal,
      CGPA: parseFloat(cgpaVal.toFixed(2))
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Academic Progression</h3>
        <p className="text-xs text-gray-400">Comparing semester performance vs cumulative grade average</p>
      </div>
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No academic data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sgpaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cgpaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#4B5563" }}
              />
              <Area
                type="monotone"
                dataKey="SGPA"
                stroke="#6366F1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sgpaColor)"
              />
              <Area
                type="monotone"
                dataKey="CGPA"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cgpaColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CGPATrendChart;
