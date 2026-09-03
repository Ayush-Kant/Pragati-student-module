import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import SampleTestCases from './SampleTestCases';
import ExecutionOutput from './ExecutionOutput';

const TestCasePanel = memo(({ testCases, executionResult, executionError, isExecuting }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasResult = Boolean(executionResult || executionError || isExecuting);

  return (
    <div className="flex-shrink-0 border-t border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        aria-expanded={isExpanded}
        aria-controls="test-panel-body"
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-500" aria-hidden="true" />
          <span>Test Cases</span>
          {hasResult && <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />}
        </div>
        {isExpanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
      </button>

      {isExpanded && (
        <div id="test-panel-body" className="max-h-80 overflow-y-auto px-4 py-3">
          {hasResult ? (
            <ExecutionOutput result={executionResult} error={executionError} isLoading={isExecuting} />
          ) : (
            <SampleTestCases testCases={testCases} />
          )}
        </div>
      )}
    </div>
  );
});

TestCasePanel.displayName = 'TestCasePanel';
export default TestCasePanel;
