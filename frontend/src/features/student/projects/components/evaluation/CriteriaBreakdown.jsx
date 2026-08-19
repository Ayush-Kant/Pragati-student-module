import { BarChart2 } from 'lucide-react';

/**
 * Per-criterion score breakdown table.
 * @param {{ criteria: object[] }} props
 */
const CriteriaBreakdown = ({ criteria }) => {
  if (!criteria?.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={16} className="text-violet-400" aria-hidden="true" />
        <h4 className="text-sm font-semibold text-gray-200">Score Breakdown</h4>
      </div>
      <div className="space-y-4">
        {criteria.map((c) => {
          const pct = Math.round((c.scored / c.maxScore) * 100);
          const barColor =
            pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <div key={c.id} className="bg-white/2 border border-white/5 rounded-xl p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 font-medium">{c.criterion}</span>
                <span className="text-sm font-bold text-gray-200">
                  {c.scored}
                  <span className="text-gray-500 font-normal text-xs">/{c.maxScore}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Feedback */}
              {c.feedback && (
                <p className="text-xs text-gray-500 leading-relaxed mt-1 italic">
                  &ldquo;{c.feedback}&rdquo;
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriteriaBreakdown;
