import { memo } from 'react';
import { Clock, Database, CheckCircle2, XCircle } from 'lucide-react';
import { formatRuntime, formatMemory, getTestCaseSummary } from '../../utils/codingChallengeHelpers';

/**
 * Compact summary row showing runtime, memory, and test case pass rate.
 *
 * @param {{ submission: object }} props
 */
const ExecutionSummary = memo(({ submission }) => {
  const { passed, total } = getTestCaseSummary(submission.testResults);

  return (
    <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
      <div className="flex items-center gap-1.5">
        <Clock size={12} className="text-teal-500" aria-hidden="true" />
        <span>{formatRuntime(submission.runtime)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Database size={12} className="text-orange-400" aria-hidden="true" />
        <span>{formatMemory(submission.memory)}</span>
      </div>
      {total > 0 && (
        <div className="flex items-center gap-1.5">
          {passed === total ? (
            <CheckCircle2 size={12} className="text-teal-400" aria-hidden="true" />
          ) : (
            <XCircle size={12} className="text-red-400" aria-hidden="true" />
          )}
          <span>
            {passed}/{total} tests passed
          </span>
        </div>
      )}
    </div>
  );
});

ExecutionSummary.displayName = 'ExecutionSummary';

export default ExecutionSummary;
