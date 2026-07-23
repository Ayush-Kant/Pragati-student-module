import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
        {payload[0].value} <span className={`font-normal ${subtleText(darkMode)}`}>placed</span>
      </p>
    </div>
  );
};

export const PlacementTrendChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No trend data recorded" darkMode={darkMode} />;
  return (
    <div className={`p-5 rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${subtleText(darkMode)}`}>Placement Trends</h4>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00bea3" stopOpacity={darkMode ? 0.25 : 0.15} />
              <stop offset="95%" stopColor="#00bea3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#3D3D3D" : "#F3F4F6"} vertical={false} />
          <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={darkMode ? "#6B7280" : "#9CA3AF"} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ stroke: "#00bea3", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area type="monotone" dataKey="placed" stroke="#00bea3" fill="url(#tealGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "#00bea3", stroke: darkMode ? "#2D2D2D" : "#fff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#00bea3", stroke: darkMode ? "#2D2D2D" : "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
