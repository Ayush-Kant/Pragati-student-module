import React from 'react';
import { BookOpen, User } from 'lucide-react';

export const ProgressCard = ({ course = {} }) => {
  const title = course.title || 'Untitled Course';
  const progress = course.progress || 0;
  const totalModules = course.totalModules || 0;
  const completedModules = course.completedModules || 0;
  const instructor = course.instructor || 'Staff';

  return (
    <div className="glass-card p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-neon-indigo/25 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-200 line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-gray-500" /> {instructor}
          </p>
        </div>
        <span className="text-xs font-extrabold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full border border-neon-cyan/20">
          {progress}%
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1.5 font-semibold">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-neon-indigo" />
            Modules: {completedModules} / {totalModules}
          </span>
          <span>{totalModules - completedModules} remaining</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden p-px border border-white/5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-cyan transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
