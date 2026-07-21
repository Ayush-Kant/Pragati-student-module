import React from 'react';
import { Award, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dashboardHelpers';

export const ScoreCard = ({ scores = [] }) => {
  const getScoreColor = (val) => {
    if (val >= 90) return { text: 'text-neon-emerald', bg: 'bg-neon-emerald', border: 'border-neon-emerald/20', lightBg: 'bg-neon-emerald/10' };
    if (val >= 80) return { text: 'text-neon-cyan', bg: 'bg-neon-cyan', border: 'border-neon-cyan/20', lightBg: 'bg-neon-cyan/10' };
    if (val >= 70) return { text: 'text-neon-gold', bg: 'bg-neon-gold', border: 'border-neon-gold/20', lightBg: 'bg-neon-gold/10' };
    return { text: 'text-neon-coral', bg: 'bg-neon-coral', border: 'border-neon-coral/20', lightBg: 'bg-neon-coral/10' };
  };

  return (
    <div className="glass-card p-4 rounded-xl border border-white/5">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Award className="w-4 h-4 text-neon-violet" /> Recent Academic Grades
      </h4>
      
      {scores.length === 0 ? (
        <div className="text-center p-4 text-gray-500 text-xs">No grades recorded yet.</div>
      ) : (
        <div className="space-y-3.5">
          {scores.map((score) => {
            const colors = getScoreColor(score.value);
            return (
              <div 
                key={score.id}
                className="p-3 rounded-lg bg-slate-900/35 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-200 line-clamp-1">
                      {score.subject}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      {score.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${colors.text} ${colors.lightBg} ${colors.border}`}>
                      {score.value}%
                    </span>
                    <p className="text-[9px] text-gray-500 mt-1 font-semibold flex items-center gap-1 justify-end">
                      <Calendar className="w-2.5 h-2.5" /> {formatDate(score.date)}
                    </p>
                  </div>
                </div>

                {/* Score representation bar */}
                <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-3 p-px">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${colors.bg}`}
                    style={{ width: `${score.value}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
