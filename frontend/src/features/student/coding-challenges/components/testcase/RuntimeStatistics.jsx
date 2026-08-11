import { memo } from 'react';
import { Clock } from 'lucide-react';
import { formatRuntime } from '../../utils/codingChallengeHelpers';

/**
 * Displays runtime statistics for an execution result.
 *
 * @param {{ runtime: number, percentile?: number }} props
 */
const RuntimeStatistics = memo(({ runtime, percentile }) => (
  <div className="flex items-center gap-3 text-xs">
    <div className="flex items-center gap-1.5 text-teal-400">
      <Clock size={13} aria-hidden="true" />
      <span className="font-semibold">{formatRuntime(runtime)}</span>
    </div>
    {percentile !== undefined && (
      <span className="text-gray-500">
        Faster than{' '}
        <span className="text-gray-300 font-medium">{percentile.toFixed(1)}%</span>{' '}
        of submissions
      </span>
    )}
  </div>
));

RuntimeStatistics.displayName = 'RuntimeStatistics';

export default RuntimeStatistics;
