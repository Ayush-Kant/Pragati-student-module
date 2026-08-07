import { memo } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Button to reset the editor to the starter code template.
 *
 * @param {{ onClick: Function, disabled?: boolean }} props
 */
const ResetEditorButton = memo(({ onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
      text-gray-500 hover:text-gray-300 hover:bg-gray-800/50
      disabled:opacity-40 disabled:cursor-not-allowed
      transition-all duration-200"
    aria-label="Reset editor to starter template"
  >
    <RotateCcw size={13} aria-hidden="true" />
    Reset
  </button>
));

ResetEditorButton.displayName = 'ResetEditorButton';

export default ResetEditorButton;
