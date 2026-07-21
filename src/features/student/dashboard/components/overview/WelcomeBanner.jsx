import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { formatXP } from '../../utils/dashboardHelpers';

export const WelcomeBanner = ({ student = {}, statistics = {} }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const name = student.name || 'Student';
  const major = student.major || 'Academy Scholar';
  const level = student.level || 1;
  const xp = statistics.totalXP || 0;
  const nextXp = statistics.nextLevelXP || 1000;
  const xpPercent = Math.min(100, Math.max(0, Math.round((xp / nextXp) * 100)));

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Background glow meshes */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-neon-indigo/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-neon-violet/10 blur-3xl animate-pulse-slow"></div>

      <div className="relative flex items-center gap-4 md:gap-6 z-10">
        <div className="relative">
          <img
            src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
            alt={name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-neon-violet/30 p-0.5 shadow-xl"
          />
          <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-tr from-neon-indigo to-neon-violet text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-space-bg shadow">
            LVL {level}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-neon-cyan flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> System Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 mb-1 tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-neon-violet">{name}</span>!
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            {major} • Grade {student.grade || 'N/A'}
          </p>
        </div>
      </div>

      {/* Mini XP Status Tracker */}
      <div className="relative z-10 bg-slate-900/40 border border-white/5 rounded-xl p-4 min-w-[240px] md:max-w-xs w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-neon-gold" /> XP Rank Progress
          </span>
          <span className="text-xs font-bold text-gray-200">
            {formatXP(xp)} <span className="text-gray-500 font-normal">/ {formatXP(nextXp)}</span>
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet shadow-[0_0_8px_rgba(139,92,246,0.5)] transition-all duration-700" 
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500">
          <span>Level {level}</span>
          <span>{xpPercent}% towards Level {level + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
