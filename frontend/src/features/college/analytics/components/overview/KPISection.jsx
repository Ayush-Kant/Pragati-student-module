import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const KPISection = ({ darkMode, placementData = [] }) => {
  const latest = placementData[placementData.length - 1] || {};
  const previous = placementData[placementData.length - 2] || {};

  const kpis = [
    {
      label: "Year-over-Year Growth",
      value: latest.rate ? `${latest.rate}%` : "0%",
      prev: previous.rate,
      curr: latest.rate,
    },
    {
      label: "Avg Package Trend",
      value: latest.avgPkg ? `${latest.avgPkg} LPA` : "0 LPA",
      prev: previous.avgPkg,
      curr: latest.avgPkg,
    },
    {
      label: "Highest Package",
      value: latest.maxPkg ? `${latest.maxPkg} LPA` : "0 LPA",
      prev: previous.maxPkg,
      curr: latest.maxPkg,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map(({ label, value, prev, curr }) => {
        const diff = (curr || 0) - (prev || 0);
        const dir = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
        const badge =
          dir === "up"
            ? "bg-emerald-50 text-emerald-700"
            : dir === "down"
            ? "bg-rose-50 text-rose-700"
            : "bg-gray-100 text-gray-600";

        return (
          <div
            key={label}
            className={`rounded-2xl border p-4 ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {label}
            </p>
            <div className="flex items-center gap-3">
              <h4 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>{value}</h4>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge}`}>
                {dir === "up" && <TrendingUp className="w-3 h-3" />}
                {dir === "down" && <TrendingDown className="w-3 h-3" />}
                {dir === "neutral" && <Minus className="w-3 h-3" />}
                {Math.abs(diff).toFixed(1)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
