import React from 'react';
import { Award, Star } from 'lucide-react';

export const ScoreCard = ({ overallScore = 0, rubricScores = [] }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" /> Project Evaluation Dossier
          </div>
          <h3 className="text-xl font-extrabold text-white">Score Breakdown</h3>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/40 px-6 py-3 rounded-2xl shadow-inner shrink-0">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          <div>
            <span className="text-3xl font-black text-white">{overallScore}</span>
            <span className="text-xs text-slate-400 font-bold"> / 100</span>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Grade Points</p>
          </div>
        </div>
      </div>

      {/* Rubric Criteria List */}
      <div className="space-y-4">
        {rubricScores.map((rubric, idx) => {
          const percentage = Math.round((rubric.score / rubric.maxScore) * 100);
          return (
            <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1.5">
                <span>{rubric.category}</span>
                <span className="text-indigo-400">
                  {rubric.score} / {rubric.maxScore} pts
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {rubric.comment && <p className="text-xs text-slate-400 italic">{rubric.comment}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreCard;
