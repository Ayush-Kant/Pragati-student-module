import React from "react";
import { Trophy, Calendar } from "lucide-react";
import { formatDate } from "../../utils/studentProfileHelpers";

export const Achievements = ({ achievements = [], darkMode }) => {
  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Achievements</h3>
        <p className="text-xs text-gray-400">Prizes won, merit awards, and accolades</p>
      </div>

      <div className="space-y-4">
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-400">No achievements recorded yet.</div>
        ) : (
          achievements.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-200 ${
                darkMode
                  ? 'border-[#ff6d34]/30 bg-[#ff6d34]/5 hover:bg-[#ff6d34]/10'
                  : 'border-amber-100 bg-amber-50/5 hover:bg-amber-50/15'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                darkMode
                  ? 'bg-[#1A1A1A] border-[#ff6d34]/30 text-[#ff6d34]'
                  : 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm shadow-amber-50'
              }`}>
                <Trophy className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className={`text-sm font-extrabold leading-snug ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
