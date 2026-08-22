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

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg border p-2.5 shadow-lg ${darkMode ? 'border-[#3D3D3D] bg-[#2D2D2D]' : 'border-gray-200 bg-white'}`}>
      <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Semester {label}</p>
      <div className="space-y-1 mt-1 text-xs">
        <p className={`font-medium ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-600'}`}>
          SGPA: <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{payload[0].value.toFixed(2)}</span>
        </p>
        <p className={`font-medium ${darkMode ? 'text-[#00bea3]' : 'text-emerald-600'}`}>
          CGPA: <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{payload[1].value.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export const CGPATrendChart = ({ data = [], darkMode }) => {
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
    <div className={`rounded-2xl border p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Academic Progression</h3>
        <p className="text-xs text-gray-400">Comparing semester performance vs cumulative grade average</p>
      </div>
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No academic data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sgpaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6d34" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ff6d34" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cgpaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00bea3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00bea3" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#F3F4F6"} vertical={false} />
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
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: darkMode ? "#9CA3AF" : "#4B5563" }}
              />
              <Area
                type="monotone"
                dataKey="SGPA"
                stroke="#ff6d34"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sgpaColor)"
              />
              <Area
                type="monotone"
                dataKey="CGPA"
                stroke="#00bea3"
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
