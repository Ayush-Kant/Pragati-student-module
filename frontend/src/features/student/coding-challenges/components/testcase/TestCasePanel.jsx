import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import SampleTestCases from './SampleTestCases';
import ExecutionOutput from './ExecutionOutput';

/**
 * Collapsible bottom panel containing sample test cases and execution output.
 *
 * @param {{
 *   testCases: object[],
 *   executionResult: object | null,
 *   executionError: string | null,
 *   isExecuting: boolean,
 * }} props
 */
const TestCasePanel = memo(({
  testCases,
  executionResult,
  executionError,
  isExecuting,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasResult = !!executionResult || !!executionError || isExecuting;

  return (
    <div className="border-t border-gray-800 flex-shrink-0 bg-[#080808]" style={{ minHeight: '120px' }}>
      {/* Panel header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-900/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="test-panel-body"
      >
        <div className="flex items-center gap-2">
          <Terminal size={13} aria-hidden="true" />
          <span>Test Cases</span>
          {hasResult && (
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
          )}
        </div>
        {/* Issue 6 fix: Up arrow = panel is open (click to collapse); Down arrow = panel is closed (click to expand) */}
        {isExpanded ? (
          <ChevronUp size={14} aria-hidden="true" />
        ) : (
          <ChevronDown size={14} aria-hidden="true" />
        )}
      </button>

      {/* Panel body */}
      {isExpanded && (
        <div
          id="test-panel-body"
          className="px-4 py-3 max-h-72 overflow-y-auto scrollbar-thin space-y-4"
        >
          {hasResult ? (
            <ExecutionOutput
              result={executionResult}
              error={executionError}
              isLoading={isExecuting}
            />
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
