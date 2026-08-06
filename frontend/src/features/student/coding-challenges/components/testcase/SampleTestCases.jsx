import { memo } from 'react';
import { FlaskConical } from 'lucide-react';

/**
 * Displays sample (visible) test cases from the challenge definition.
 *
 * @param {{ testCases: object[] }} props
 */
const SampleTestCases = memo(({ testCases }) => {
  if (!testCases?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <FlaskConical size={13} aria-hidden="true" />
        Sample Test Cases
      </h3>
      {testCases.map((tc, idx) => (
        <div
          key={tc.id}
          className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-400"
        >
          <p className="text-gray-600 mb-1 font-sans text-xs">Case {idx + 1}</p>
          <div className="space-y-0.5">
            <p><span className="text-gray-600">Input: </span>{tc.input}</p>
            <p><span className="text-gray-600">Expected: </span><span className="text-teal-400">{tc.expectedOutput}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
});

SampleTestCases.displayName = 'SampleTestCases';

export default SampleTestCases;
