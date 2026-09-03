import { memo } from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import RuntimeStatistics from './RuntimeStatistics';
import MemoryUsage from './MemoryUsage';
import { getVerdictClasses } from '../../utils/codingChallengeHelpers';
import { VERDICT } from '../../constants/codingChallengeConstants';

const VERDICT_ICONS = {
  [VERDICT.ACCEPTED]: CheckCircle2,
  [VERDICT.WRONG_ANSWER]: XCircle,
  [VERDICT.TIME_LIMIT_EXCEEDED]: AlertTriangle,
  [VERDICT.MEMORY_LIMIT_EXCEEDED]: AlertTriangle,
  [VERDICT.RUNTIME_ERROR]: XCircle,
  [VERDICT.COMPILATION_ERROR]: XCircle,
};

/**
 * Displays execution results, preserving the actual backend verdict instead
 * of collapsing every failed run into "Wrong Answer".
 */
const ExecutionOutput = memo(({ result, error, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 p-3">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
        Running against sample test cases…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
        <p className="font-semibold mb-1">Execution Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const verdict = result.verdict || (
    result.testResults?.every((test) => test.passed)
      ? VERDICT.ACCEPTED
      : VERDICT.WRONG_ANSWER
  );
  const Icon = VERDICT_ICONS[verdict] || AlertTriangle;
  const verdictClasses = getVerdictClasses(verdict);
  const isCompilationError = verdict === VERDICT.COMPILATION_ERROR;
  const isRuntimeError = verdict === VERDICT.RUNTIME_ERROR;

  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${verdictClasses}`}>
        <Icon size={14} aria-hidden="true" />
        {verdict}
      </div>

      <div className="flex items-center gap-4 flex-wrap rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
        <RuntimeStatistics runtime={result.runtime} />
        <MemoryUsage memory={result.memory} />
      </div>

      {(isCompilationError || isRuntimeError) && (result.stderr || result.compileOutput || result.message) && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-semibold text-red-800 mb-2">
            {isCompilationError ? 'Compiler output' : 'Runtime output'}
          </p>
          <pre className="whitespace-pre-wrap break-words text-xs leading-5 font-mono text-red-700">
            {result.compileOutput || result.stderr || result.message}
          </pre>
        </div>
      )}

      {result.testResults?.length > 0 && !isCompilationError && !isRuntimeError && (
        <div className="space-y-2">
          {result.testResults.map((testCase, index) => {
            const testVerdict = testCase.verdict || (testCase.passed ? VERDICT.ACCEPTED : VERDICT.WRONG_ANSWER);
            return (
              <div
                key={testCase.id ?? index}
                className={`rounded-xl border p-4 text-sm ${
                  testCase.passed
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {testCase.passed ? (
                    <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
                  ) : (
                    <XCircle size={14} className="text-red-600" aria-hidden="true" />
                  )}
                  <span className={`font-semibold ${testCase.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                    Test Case {index + 1} — {testCase.passed ? 'Passed' : testVerdict}
                  </span>
                  <span className="ml-auto text-xs text-slate-500">
                    {testCase.runtime != null ? `${testCase.runtime} ms` : '—'}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs text-slate-600 break-words">
                  <p><span className="text-slate-400">Input: </span>{testCase.input}</p>
                  <p><span className="text-slate-400">Expected: </span><span className="text-emerald-700">{testCase.expected}</span></p>
                  {!testCase.passed && (
                    <p><span className="text-slate-400">Got: </span><span className="text-red-700">{testCase.actual || 'No output'}</span></p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {result.stdout && !isCompilationError && !isRuntimeError && (
        <div className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-100">
          <p className="font-semibold text-slate-300 mb-2">Program output</p>
          <pre className="whitespace-pre-wrap break-words">{result.stdout}</pre>
        </div>
      )}

      {result.stderr && !isCompilationError && !isRuntimeError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-mono text-red-700">
          <p className="font-semibold mb-1">stderr</p>
          <pre className="whitespace-pre-wrap break-words">{result.stderr}</pre>
        </div>
      )}
    </div>
  );
});

ExecutionOutput.displayName = 'ExecutionOutput';

export default ExecutionOutput;
