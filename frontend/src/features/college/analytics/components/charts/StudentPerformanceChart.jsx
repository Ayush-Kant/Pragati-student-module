import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EmptyState } from "../common/EmptyState";
import { headingText, subtleText } from "../../utils/analyticsHelpers";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-lg ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-200"
    }`}>
      <p className={`text-xs font-medium ${subtleText(darkMode)}`}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className={`text-sm font-semibold ${headingText(darkMode)}`}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export const StudentPerformanceChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No student performance data" darkMode={darkMode} />;
  return (
    <div className={`p-5 rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${subtleText(darkMode)}`}>Student Performance by CGPA</h4>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#F3F4F6"} vertical={false} />
          <XAxis dataKey="range" fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="placed" name="Placed" fill="#00bea3" radius={[6, 6, 0, 0]} maxBarSize={30} />
          <Bar dataKey="unplaced" name="Unplaced" fill="#ff6d34" radius={[6, 6, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
