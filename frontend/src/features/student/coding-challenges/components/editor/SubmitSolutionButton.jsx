import { memo } from 'react';
import { Send, Loader2 } from 'lucide-react';

/**
 * Button that triggers final solution submission.
 *
 * @param {{ onClick: Function, isLoading?: boolean, disabled?: boolean }} props
 */
const SubmitSolutionButton = memo(({ onClick, isLoading = false, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading || disabled}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold
      bg-gradient-to-r from-orange-500 to-orange-600 text-white
      shadow-lg shadow-orange-500/30
      hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/50 hover:scale-105
      disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
      transition-all duration-200"
    aria-label={isLoading ? 'Submitting solution…' : 'Submit solution'}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <Loader2 size={13} className="animate-spin" aria-hidden="true" />
    ) : (
      <Send size={13} aria-hidden="true" />
    )}
    {isLoading ? 'Submitting…' : 'Submit'}
  </button>
));

SubmitSolutionButton.displayName = 'SubmitSolutionButton';

export default SubmitSolutionButton;
