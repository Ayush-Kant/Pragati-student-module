import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { EmptyState } from "../common/EmptyState";
import { headingText, subtleText } from "../../utils/analyticsHelpers";

const COLORS = ["#00bea3", "#ff6d34", "#F59E0B", "#8B5CF6", "#EC4899"];

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 shadow-lg ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-200"
    }`}>
      <p className={`text-xs font-semibold ${headingText(darkMode)}`}>
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
};

export const PackageDistributionChart = ({ data = [], darkMode = false }) => {
  if (!data || data.length === 0) return <EmptyState message="No package data available" darkMode={darkMode} />;
  return (
    <div className={`p-5 rounded-2xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
      darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
    }`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${subtleText(darkMode)}`}>Package Distribution</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="count" nameKey="range">
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
