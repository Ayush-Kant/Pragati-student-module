import { memo } from 'react';
import { Database } from 'lucide-react';
import { formatMemory } from '../../utils/codingChallengeHelpers';

/**
 * Displays memory usage for an execution result.
 *
 * @param {{ memory: number, percentile?: number }} props
 */
const MemoryUsage = memo(({ memory, percentile }) => (
  <div className="flex items-center gap-3 text-xs">
    <div className="flex items-center gap-1.5 text-orange-400">
      <Database size={13} aria-hidden="true" />
      <span className="font-semibold">{formatMemory(memory)}</span>
    </div>
    {percentile !== undefined && (
      <span className="text-gray-500">
        Less than{' '}
        <span className="text-gray-300 font-medium">{percentile.toFixed(1)}%</span>{' '}
        of submissions
      </span>
    )}
  </div>
));

MemoryUsage.displayName = 'MemoryUsage';

export default MemoryUsage;
