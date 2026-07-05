import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatsCard = ({ title, value, change, trend = "up", icon: Icon, iconBg }) => {
  const isUp = trend === "up";
  const isDown = trend === "down";
  
  const trendClass = isUp 
    ? "bg-emerald-50 text-emerald-700" 
    : isDown 
      ? "bg-rose-50 text-rose-700" 
      : "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
            {title}
          </p>

          <h3 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
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

        <span className="text-gray-400 text-xs font-medium">
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;