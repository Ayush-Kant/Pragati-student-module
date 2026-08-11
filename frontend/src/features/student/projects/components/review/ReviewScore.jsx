import React from "react";
import { Award, CheckCircle } from "lucide-react";

export const ReviewScore = ({ score = 0, grade = "A", rubrics = [] }) => {
  return (
    <div className="bg-gradient-to-br from-brand-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-brand-400/30">
        <div>
          <span className="px-3 py-1 text-xs font-semibold bg-white/20 rounded-full uppercase tracking-wider">
            Overall Evaluation Score
          </span>
          <div className="flex items-baseline space-x-3 mt-2">
            <h2 className="text-4xl md:text-5xl font-black">{score}</h2>
            <span className="text-lg font-medium text-brand-200">/ 100</span>
            <span className="px-3 py-1 text-sm font-extrabold bg-emerald-400 text-surface-900 rounded-lg ml-2">
              Grade {grade}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md flex items-center space-x-3">
          <Award className="w-10 h-10 text-amber-300 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-brand-200">Review Status</p>
            <p className="text-sm font-bold text-white">Under Evaluation</p>
          </div>
        </div>
      </div>

      {/* Rubric scores breakdown */}
      {rubrics && rubrics.length > 0 && (
        <div className="pt-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-200 mb-2">Evaluation Rubric Breakdown</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rubrics.map((r, idx) => (
              <div key={idx} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>{r.category}</span>
                  <span className="font-bold">{r.score}/{r.maxScore}</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${(r.score / r.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewScore;
