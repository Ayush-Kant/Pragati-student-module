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
 * Displays execution results without collapsing judge failures into
 * "Wrong Answer" and preserves the diagnostics returned by Judge0.
 */
const ExecutionOutput = memo(({ result, error, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 text-sm text-slate-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" aria-hidden="true" />
        Running against sample test cases…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="mb-1 font-semibold">Execution Error</p>
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
  const hasDiagnostic = Boolean(result.compileOutput || result.stderr || result.message);
  const isCompilationError = verdict === VERDICT.COMPILATION_ERROR;
  const isRuntimeError = verdict === VERDICT.RUNTIME_ERROR;

  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${verdictClasses}`}>
        <Icon size={14} aria-hidden="true" />
        {verdict}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <RuntimeStatistics runtime={result.runtime} />
        <MemoryUsage memory={result.memory} />
      </div>

      {hasDiagnostic && verdict !== VERDICT.ACCEPTED && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-semibold text-red-800">
            {isCompilationError ? 'Compiler output' : isRuntimeError ? 'Runtime output' : 'Judge diagnostics'}
          </p>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-red-700">
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
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
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

                <div className="space-y-1 break-words font-mono text-xs text-slate-600">
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
        <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100">
          <p className="mb-2 font-semibold text-slate-300">Program output</p>
          <pre className="whitespace-pre-wrap break-words">{result.stdout}</pre>
        </div>
      )}

      {result.stderr && !isCompilationError && !isRuntimeError && !hasDiagnostic && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-mono text-xs text-red-700">
          <p className="mb-1 font-semibold">stderr</p>
          <pre className="whitespace-pre-wrap break-words">{result.stderr}</pre>
        </div>
      )}
    </div>
  );
});

ExecutionOutput.displayName = 'ExecutionOutput';

export default ExecutionOutput;
