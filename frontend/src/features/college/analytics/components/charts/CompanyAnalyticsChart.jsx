import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EmptyState } from "../common/EmptyState";
import { headingText, subtleText } from "../../utils/analyticsHelpers";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-lg ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-200"
    }`}>
      <p className={`text-xs font-medium ${subtleText(darkMode)}`}>{label}</p>
      <p className={`text-sm font-semibold ${headingText(darkMode)}`}>
        {payload[0].value} <span className={`font-normal ${subtleText(darkMode)}`}>offers</span>
      </p>
    </div>
  );
};

export const CompanyAnalyticsChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No company data available" darkMode={darkMode} />;
  return (
    <div className={`p-5 rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${subtleText(darkMode)}`}>Company Placements</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#F3F4F6"} horizontal={false} />
          <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <YAxis dataKey="company" type="category" fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} width={75} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? "rgba(255,109,52,0.08)" : "rgba(255,109,52,0.06)" }} />
          <Bar dataKey="offers" fill="#ff6d34" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
