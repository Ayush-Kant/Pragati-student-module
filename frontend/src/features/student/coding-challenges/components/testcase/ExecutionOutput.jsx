import { memo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import RuntimeStatistics from './RuntimeStatistics';
import MemoryUsage from './MemoryUsage';
import { getVerdictClasses } from '../../utils/codingChallengeHelpers';
import { VERDICT } from '../../constants/codingChallengeConstants';

/**
 * Displays the execution output panel after running code.
 * Shows per-test-case results and aggregate runtime/memory stats.
 *
 * @param {{ result: object, error: string | null, isLoading?: boolean }} props
 */
const ExecutionOutput = memo(({ result, error, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 p-3">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
        Executing code…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
        <p className="font-semibold mb-1">Execution Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const allPassed = result.testResults?.every((t) => t.passed);
  const verdictClasses = getVerdictClasses(
    allPassed ? VERDICT.ACCEPTED : VERDICT.WRONG_ANSWER
  );

  return (
    <div className="space-y-3">
      {/* Verdict */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${verdictClasses}`}>
        {allPassed ? (
          <CheckCircle2 size={13} aria-hidden="true" />
        ) : (
          <XCircle size={13} aria-hidden="true" />
        )}
        {allPassed ? VERDICT.ACCEPTED : VERDICT.WRONG_ANSWER}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <RuntimeStatistics runtime={result.runtime} />
        <MemoryUsage memory={result.memory} />
      </div>

      {/* Per-test-case results */}
      {result.testResults?.length > 0 && (
        <div className="space-y-2">
          {result.testResults.map((tc, idx) => (
            <div
              key={tc.id}
              className={`p-3 rounded-lg border text-xs font-mono ${
                tc.passed
                  ? 'bg-teal-500/5 border-teal-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {tc.passed ? (
                  <CheckCircle2 size={12} className="text-teal-400" aria-hidden="true" />
                ) : (
                  <XCircle size={12} className="text-red-400" aria-hidden="true" />
                )}
                <span className={`font-semibold ${tc.passed ? 'text-teal-400' : 'text-red-400'}`}>
                  Test Case {idx + 1} — {tc.passed ? 'Passed' : 'Failed'}
                </span>
                <span className="ml-auto text-gray-600">{tc.runtime} ms</span>
              </div>
              <div className="space-y-0.5 text-gray-400">
                <p><span className="text-gray-600">Input: </span>{tc.input}</p>
                <p><span className="text-gray-600">Expected: </span><span className="text-teal-400">{tc.expected}</span></p>
                {!tc.passed && (
                  <p><span className="text-gray-600">Got: </span><span className="text-red-400">{tc.actual}</span></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {result.stderr && (
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs font-mono text-red-400">
          <p className="font-semibold mb-1">stderr</p>
          <pre className="whitespace-pre-wrap">{result.stderr}</pre>
        </div>
      )}
    </div>
  );
});

ExecutionOutput.displayName = 'ExecutionOutput';

export default ExecutionOutput;
