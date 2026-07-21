import React from 'react';
import { Award, Zap, History } from 'lucide-react';
import { formatXP } from '../../utils/dashboardHelpers';

export const XPProgress = ({ xpData = {} }) => {
  const currentXP = xpData.current || 0;
  const targetXP = xpData.target || 1000;
  const percentage = xpData.percentage || 0;
  const history = xpData.history || [];

  const maxHistoryXP = history.length > 0 ? Math.max(...history.map(item => item.xp)) : 100;

  return (
    <div className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-4 border-b border-space-border mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-gold animate-pulse" /> XP Progress Engine
        </h3>
        <span className="text-[10px] font-bold text-neon-gold bg-neon-gold/10 px-2.5 py-0.5 rounded-full border border-neon-gold/20 flex items-center gap-1">
          <Award className="w-3 h-3" /> Tier 1 Scholar
        </span>
      </div>

      {/* Progress ring/linear progress details */}
      <div className="mb-6 bg-slate-900/30 border border-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span className="font-semibold">Level Milestone</span>
          <span className="text-white font-bold">{formatXP(currentXP)} / {formatXP(targetXP)} XP</span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-neon-gold via-yellow-400 to-neon-violet transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.4)]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2">
          <span>Current Level</span>
          <span>{percentage}% complete • {targetXP - currentXP} XP to Level-Up</span>
        </div>
      </div>

      {/* Bar Chart section */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400">
          <History className="w-3.5 h-3.5" />
          <span>Weekly Activity Load</span>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center p-4 text-gray-500 text-xs">No XP logs recorded.</div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-28 pt-2 pb-1 px-2 bg-slate-950/40 rounded-xl border border-white/5">
            {history.map((item, idx) => {
              const heightPct = Math.max(12, Math.round((item.xp / maxHistoryXP) * 80));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="absolute -translate-y-16 bg-slate-900 border border-white/10 text-white text-[9px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
                    +{item.xp} XP
                  </div>
                  
                  {/* Glowing Bar */}
                  <div 
                    className="w-full rounded-t-md bg-gradient-to-t from-neon-gold/40 to-neon-gold group-hover:from-neon-violet group-hover:to-neon-violet transition-all duration-300 relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-md transition-opacity"></div>
                  </div>
                  
                  {/* X-axis Label */}
                  <span className="text-[10px] text-gray-500 font-bold mt-2 group-hover:text-gray-300 transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default XPProgress;
