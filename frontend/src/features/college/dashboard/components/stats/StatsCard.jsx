import React from "react";
import { TrendingUp } from "lucide-react";

const StatsCard = ({ title, value, change }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-orange-600" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-green-600 text-sm font-semibold">
          {change}
        </span>

        <span className="text-gray-500 text-sm">
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;