import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EmptyState } from "../common/EmptyState";

const COLORS = ["#2563eb", "#06B6D4", "#F59E0B", "#10B981", "#8B5CF6"];

export const PackageDistributionChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No package data available" darkMode={darkMode} />;
  return (
    <div className={`p-4 rounded-xl border h-64 ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Package Distribution</h4>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="count" nameKey="range">
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px", backgroundColor: darkMode ? "#2D2D2D" : "#fff", border: `1px solid ${darkMode ? "#3D3D3D" : "#E5E7EB"}`, color: darkMode ? "#fff" : "#333" }} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
