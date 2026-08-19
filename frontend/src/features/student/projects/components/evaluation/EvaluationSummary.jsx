import { Award, Star, Calendar, User } from 'lucide-react';
import { resolveGrade, getGradeColor, formatDate } from '../../utils/projectHelpers';

/**
 * Top-level evaluation summary card.
 * @param {{ evaluation: object }} props
 */
const EvaluationSummary = ({ evaluation }) => {
  const { grade, label } = resolveGrade(evaluation.percentage);
  const gradeColor = getGradeColor(grade);

  return (
    <div className="bg-gradient-to-br from-teal-500/10 via-transparent to-violet-500/10 border border-white/8 rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-500/15 border border-teal-500/20">
            <Award size={28} className="text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Final Score</p>
            <p className="text-3xl font-extrabold text-gray-100">
              {evaluation.totalScore}
              <span className="text-lg text-gray-500 font-normal">/{evaluation.maxScore}</span>
            </p>
          </div>
        </div>

        {/* Grade */}
        <div className="text-right">
          <p className={`text-5xl font-extrabold ${gradeColor}`}>{grade}</p>
          <p className="text-sm text-gray-400 mt-0.5">{label}</p>
        </div>

        {/* Percentage ring-like display */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90" aria-hidden="true">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={evaluation.percentage >= 80 ? '#34d399' : evaluation.percentage >= 60 ? '#60a5fa' : '#f87171'}
                strokeWidth="2.5"
                strokeDasharray={`${evaluation.percentage} ${100 - evaluation.percentage}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-200">
              {evaluation.percentage}%
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1">Percentage</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/6">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <User size={12} aria-hidden="true" />
          <span>Evaluated by <span className="text-gray-300">{evaluation.evaluatedBy}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} aria-hidden="true" />
          <span>{formatDate(evaluation.evaluatedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Star size={12} className="text-yellow-400" aria-hidden="true" />
          <span className="text-yellow-400 font-medium">{grade}</span>
          <span className="text-gray-500">— {label}</span>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
