import React from "react";
import { Trophy, Calendar } from "lucide-react";
import { formatDate } from "../../utils/studentProfileHelpers";

export const Achievements = ({ achievements = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Achievements</h3>
        <p className="text-xs text-gray-400">Prizes won, merit awards, and accolades</p>
      </div>

      <div className="space-y-4">
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No achievements recorded yet.</div>
        ) : (
          achievements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-amber-100 bg-amber-50/5 hover:bg-amber-50/15 flex items-start gap-4 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm shadow-amber-50 flex-shrink-0">
                <Trophy className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-extrabold text-gray-800 leading-snug">{item.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;
