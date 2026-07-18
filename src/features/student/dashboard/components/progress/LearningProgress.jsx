import React from 'react';
import { Target, Award, ArrowUpRight } from 'lucide-react';
import ProgressCard from './ProgressCard';

export const LearningProgress = ({ progressData = {} }) => {
  const courses = progressData.courseProgress || [];
  const currentModule = progressData.moduleProgress || {};

  return (
    <div className="space-y-6">
      {/* Current Active Module Showcase */}
      {currentModule.currentModuleName && (
        <div className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-neon-indigo/5 blur-2xl"></div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-neon-indigo/10 text-neon-indigo border border-neon-indigo/20 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-neon-indigo uppercase tracking-wider">
                  Active Milestone
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {currentModule.currentModuleName}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  Course: {currentModule.courseTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 min-w-[160px]">
              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1 font-bold">
                  <span>MODULE PROGRESS</span>
                  <span>{currentModule.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet shadow-[0_0_6px_rgba(99,102,241,0.5)] transition-all duration-700" 
                    style={{ width: `${currentModule.percentage}%` }}
                  ></div>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-white/5 text-gray-300 hover:text-white transition-all duration-200">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-neon-cyan" /> Enrolled Courses ({courses.length})
          </h3>
        </div>

        {courses.length === 0 ? (
          <div className="text-center p-6 text-gray-500 glass-card rounded-xl">
            No registered courses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <ProgressCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgress;
