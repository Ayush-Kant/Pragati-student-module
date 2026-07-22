import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatsCard = ({ darkMode, title, value, change, trend = "up", icon: Icon, iconBg }) => {
  const isUp = trend === "up";
  const isDown = trend === "down";
  
  const trendClass = isUp 
    ? "bg-emerald-50 text-emerald-700" 
    : isDown 
      ? "bg-rose-50 text-rose-700" 
      : "bg-gray-50 text-gray-600";

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-100"
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs font-bold tracking-wider uppercase ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}>
            {title}
          </p>

          <h3 className={`text-3xl font-extrabold mt-2 tracking-tight ${
            darkMode ? "text-white" : "text-[#2D3436]"
          }`}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg || "bg-indigo-50 text-indigo-600 border border-indigo-100"}`}>
            <Icon className="w-5.5 h-5.5" />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendClass}`}>
          {isUp && <TrendingUp className="w-3 h-3" />}
          {isDown && <TrendingDown className="w-3 h-3" />}
          {!isUp && !isDown && <Minus className="w-3 h-3" />}
          {change}
        </span>

        <span className={`text-xs font-medium ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}>
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;