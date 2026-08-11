import { memo } from 'react';
import { Play, Loader2 } from 'lucide-react';

/**
 * Button that triggers code execution against sample test cases.
 *
 * @param {{ onClick: Function, isLoading?: boolean, disabled?: boolean }} props
 */
const RunCodeButton = memo(({ onClick, isLoading = false, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading || disabled}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold
      border border-gray-700 text-gray-200 bg-[#141414]
      hover:border-teal-500/60 hover:text-teal-400 hover:bg-teal-500/5
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200"
    aria-label={isLoading ? 'Running code…' : 'Run code'}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <Loader2 size={13} className="animate-spin" aria-hidden="true" />
    ) : (
      <Play size={13} aria-hidden="true" />
    )}
    {isLoading ? 'Running…' : 'Run Code'}
  </button>
));

RunCodeButton.displayName = 'RunCodeButton';

export default RunCodeButton;
