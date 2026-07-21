import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import ScoreCard from './ScoreCard';
import RankCard from './RankCard';

export const PerformanceSummary = ({ performanceData = {} }) => {
  const gpa = performanceData.gpa || 0.0;
  const rank = performanceData.rank || 1;
  const previousRank = performanceData.previousRank || rank;
  const scores = performanceData.scores || [];
  const trend = performanceData.trend || [];

  // Calculate percentage of GPA for visual meter
  const gpaPct = Math.min(100, Math.max(0, Math.round((gpa / 4.0) * 100)));

  return (
    <div className="space-y-6">
      {/* GPA Banner Dashboard */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between">
        {/* Glow backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon-cyan/5 blur-3xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-wider">
              Academic Standing
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">
              Excellent Standing
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              Your overall GPA satisfies dean's honor list requirements.
            </p>
          </div>
        </div>

        {/* GPA Progress Circle */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-neon-cyan drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 - (gpaPct / 100) * 163.3}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">{gpa.toFixed(2)}</span>
          </div>
          <div>
            <div className="text-lg font-black text-white">Cumulative GPA</div>
            <div className="text-[11px] text-gray-500 font-bold uppercase">Scale: 4.00 Max</div>
          </div>
        </div>
      </div>

      {/* Grid containing Rank details & Score details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RankCard rank={rank} previousRank={previousRank} trend={trend} />
        <ScoreCard scores={scores} />
      </div>
    </div>
  );
};

export default PerformanceSummary;
