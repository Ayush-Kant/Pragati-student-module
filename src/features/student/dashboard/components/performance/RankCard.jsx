import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const RankCard = ({ rank = 12, previousRank = 15, trend = [] }) => {
  const diff = previousRank - rank; // If rank is smaller, position climbed!

  const renderTrendStatus = () => {
    if (diff > 0) {
      return (
        <div className="flex items-center gap-1 text-[11px] font-bold text-neon-emerald">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Climbed +{diff} places this week</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center gap-1 text-[11px] font-bold text-neon-coral">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Dropped {Math.abs(diff)} spots</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
          <Minus className="w-3.5 h-3.5" />
          <span>Rank held stable</span>
        </div>
      );
    }
  };

  const maxGPA = trend.length > 0 ? Math.max(...trend.map(t => t.gpa)) : 4.0;
  const minGPA = trend.length > 0 ? Math.min(...trend.map(t => t.gpa)) : 0.0;
  const gpaDiff = maxGPA - minGPA || 1.0;

  return (
    <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col justify-between h-full">
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-gold" /> Leaderboard Standings
        </h4>

        <div className="flex items-center gap-4 py-2">
          <div className="text-4xl font-extrabold text-white tracking-tight glow-text bg-slate-900/50 w-16 h-16 rounded-xl border border-white/5 flex items-center justify-center">
            #{rank}
          </div>
          <div>
            <h5 className="text-sm font-bold text-gray-200">Global Student Rank</h5>
            <div className="mt-1">{renderTrendStatus()}</div>
          </div>
        </div>
      </div>

      {/* GPA history sparkline */}
      {trend.length > 0 && (
        <div className="mt-4 border-t border-space-border pt-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            GPA Progression Trend
          </span>
          <div className="flex items-end justify-between h-14 px-2 py-1 bg-slate-950/45 rounded-lg border border-white/5">
            {trend.map((t, idx) => {
              // Normalize height between 20% and 85% for sparkline visibility
              const heightPct = Math.round(20 + ((t.gpa - minGPA) / gpaDiff) * 65);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer relative">
                  {/* Tooltip */}
                  <div className="absolute -top-7 bg-slate-900 border border-white/10 text-white text-[9px] font-bold py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {t.gpa.toFixed(2)}
                  </div>
                  <div 
                    className="w-3.5 rounded-t bg-neon-cyan/70 group-hover:bg-neon-cyan transition-all"
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span className="text-[8px] font-bold text-gray-600 mt-1">{t.week}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankCard;
