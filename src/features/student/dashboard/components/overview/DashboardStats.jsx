import React from 'react';
import { Zap, Trophy, CalendarDays, Clock } from 'lucide-react';
import { formatXP } from '../../utils/dashboardHelpers';

export const DashboardStats = ({ statistics = {} }) => {
  const stats = [
    {
      id: 'xp',
      label: 'Experience Points',
      value: `${formatXP(statistics.totalXP || 0)} XP`,
      subtext: '+350 XP earned this week',
      icon: Zap,
      colorClass: 'text-neon-violet',
      bgGlow: 'bg-neon-violet/10',
      borderColor: 'hover:border-neon-violet/30'
    },
    {
      id: 'rank',
      label: 'Academic Rank',
      value: `#${statistics.rank || '-'}`,
      subtext: `Out of ${statistics.totalStudents || 100} students`,
      icon: Trophy,
      colorClass: 'text-neon-gold',
      bgGlow: 'bg-neon-gold/10',
      borderColor: 'hover:border-neon-gold/30'
    },
    {
      id: 'attendance',
      label: 'Attendance Rate',
      value: `${statistics.attendanceRate || 0}%`,
      subtext: 'Target attendance is 90%+',
      icon: CalendarDays,
      colorClass: 'text-neon-emerald',
      bgGlow: 'bg-neon-emerald/10',
      borderColor: 'hover:border-neon-emerald/30'
    },
    {
      id: 'studyTime',
      label: 'Study Duration',
      value: `${statistics.studyTimeThisWeekHours || 0} hrs`,
      subtext: 'Learning engagement time',
      icon: Clock,
      colorClass: 'text-neon-cyan',
      bgGlow: 'bg-neon-cyan/10',
      borderColor: 'hover:border-neon-cyan/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={stat.id}
            className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group border border-white/5 ${stat.borderColor}`}
          >
            {/* Ambient inner Glow */}
            <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-40 group-hover:scale-150 transition-all duration-500 ${stat.bgGlow}`}></div>
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl bg-slate-800/40 border border-white/5 ${stat.colorClass} shadow`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
