import { memo } from 'react';
import LanguageSelector from './LanguageSelector';
import RunCodeButton from './RunCodeButton';
import SubmitSolutionButton from './SubmitSolutionButton';
import ResetEditorButton from './ResetEditorButton';

/**
 * Sticky toolbar shown above the Monaco editor.
 * Composes LanguageSelector, run/submit/reset actions.
 *
 * @param {{
 *   language: string,
 *   onLanguageChange: Function,
 *   onRunCode: Function,
 *   onSubmit: Function,
 *   onReset: Function,
 *   isExecuting?: boolean,
 *   isSubmitting?: boolean,
 * }} props
 */
const EditorToolbar = memo(({
  language,
  onLanguageChange,
  onRunCode,
  onSubmit,
  onReset,
  isExecuting = false,
  isSubmitting = false,
}) => {
  const busy = isExecuting || isSubmitting;

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#0c0c0c] border-b border-gray-800/80 flex-shrink-0">
      {/* Left: Language selector + reset */}
      <div className="flex items-center gap-2">
        <LanguageSelector language={language} onChange={onLanguageChange} />
        <ResetEditorButton onClick={onReset} disabled={busy} />
      </div>

      {/* Right: Run + Submit */}
      <div className="flex items-center gap-2">
        <RunCodeButton
          onClick={onRunCode}
          isLoading={isExecuting}
          disabled={busy}
        />
        <SubmitSolutionButton
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={busy}
        />
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;
