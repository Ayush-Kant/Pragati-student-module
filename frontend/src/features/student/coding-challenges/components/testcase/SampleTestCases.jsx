import { memo } from 'react';
import { FlaskConical } from 'lucide-react';

const SampleTestCases = memo(({ testCases }) => {
  if (!testCases?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        No public sample test cases were configured for this challenge.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
        <FlaskConical size={13} aria-hidden="true" />
        Sample Test Cases
      </h3>
      {testCases.map((testCase, index) => (
        <div key={testCase.id ?? index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700">
          <p className="mb-2 font-sans text-xs font-semibold text-slate-500">Case {index + 1}</p>
          <div className="space-y-1">
            <p><span className="font-sans text-slate-400">Input: </span>{testCase.input}</p>
            <p><span className="font-sans text-slate-400">Expected: </span><span className="font-semibold text-emerald-700">{testCase.expectedOutput}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
});

SampleTestCases.displayName = 'SampleTestCases';
export default SampleTestCases;
