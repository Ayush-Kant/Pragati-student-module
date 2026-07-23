import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EmptyState } from "../common/EmptyState";

export const HiringTrendChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No hiring history tracked" darkMode={darkMode} />;
  return (
    <div className={`p-4 rounded-xl border h-64 ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Hiring Trajectory</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#F3F4F6"} vertical={false} />
          <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <YAxis fontSize={10} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <Tooltip contentStyle={{ backgroundColor: darkMode ? "#2D2D2D" : "#fff", borderRadius: "8px", border: `1px solid ${darkMode ? "#3D3D3D" : "#E5E7EB"}`, fontSize: "11px", color: darkMode ? "#fff" : "#333" }} />
          <Line type="monotone" dataKey="hired" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: "#F59E0B" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
