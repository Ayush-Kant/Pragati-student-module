import { memo } from 'react';
import { CheckCircle2, XCircle, BarChart2, TrendingUp } from 'lucide-react';
import { VERDICT } from '../../constants/codingChallengeConstants';
import { formatRuntime } from '../../utils/codingChallengeHelpers';

/**
 * Aggregate statistics panel over a list of submissions.
 *
 * @param {{ submissions: object[] }} props
 */
const SubmissionStatistics = memo(({ submissions }) => {
  if (!submissions?.length) return null;

  const accepted = submissions.filter((s) => s.verdict === VERDICT.ACCEPTED);
  const total = submissions.length;
  const acceptanceRate = total > 0 ? ((accepted.length / total) * 100).toFixed(1) : '0.0';

  const runtimes = accepted.map((s) => s.runtime).filter((r) => r !== undefined && r !== null);
  const bestRuntime = runtimes.length > 0 ? Math.min(...runtimes) : null;

  const stats = [
    { icon: BarChart2,    label: 'Total Submissions', value: total,                       color: 'text-gray-300' },
    { icon: CheckCircle2, label: 'Accepted',           value: accepted.length,             color: 'text-teal-400' },
    { icon: XCircle,      label: 'Rejected',           value: total - accepted.length,     color: 'text-red-400'  },
    { icon: TrendingUp,   label: 'Acceptance Rate',    value: `${acceptanceRate}%`,        color: 'text-orange-400' },
  ];

  if (bestRuntime !== null) {
    stats.push({ icon: CheckCircle2, label: 'Best Runtime', value: formatRuntime(bestRuntime), color: 'text-teal-300' });
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-center"
        >
          <Icon size={18} className={`mx-auto mb-1.5 ${color}`} aria-hidden="true" />
          <p className={`text-lg font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
});

SubmissionStatistics.displayName = 'SubmissionStatistics';

export default SubmissionStatistics;
