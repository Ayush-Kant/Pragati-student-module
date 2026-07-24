import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const STATUS_COLORS = {
  Placed: "#3B82F6",             // Blue
  "Interview Scheduled": "#6366F1", // Indigo
  Rejected: "#EF4444",           // Red
  Offered: "#10B981",            // Emerald
  Pending: "#F59E0B"             // Amber
};

export const PlacementChart = ({ placements = [], darkMode }) => {
  // Aggregate application statuses
  const statusCounts = placements.reduce((acc, curr) => {
    const status = curr.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
    color: STATUS_COLORS[status] || "#6B7280"
  }));

  const totalApplications = placements.length;

  return (
    <div className={`rounded-2xl border p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div>
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Application Funnel</h3>
        <p className="text-xs text-gray-400">Status breakdown of applied companies</p>
      </div>

      <div className="h-56 relative flex items-center justify-center my-2">
        {totalApplications === 0 ? (
          <div className="text-xs text-gray-400">No applications tracked</div>
        ) : (
          <>
            {/* Center Label */}
            <div className="absolute text-center">
              <span className={`block text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalApplications}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Applied</span>
            </div>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className={`rounded-lg p-2 border shadow-md text-xs ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{payload[0].name}:</span>{" "}
                        <span className="font-bold text-[#ff6d34]">{payload[0].value}</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
        {chartData.map((item, index) => (
          <div key={index} className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
            {item.name} ({item.value})
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementChart;
