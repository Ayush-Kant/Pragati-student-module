import { memo } from 'react';
import LanguageSelector from './LanguageSelector';
import RunCodeButton from './RunCodeButton';
import SubmitSolutionButton from './SubmitSolutionButton';
import ResetEditorButton from './ResetEditorButton';

const EditorToolbar = memo(({ language, onLanguageChange, onRunCode, onSubmit, onReset, isExecuting = false, isSubmitting = false, disabled = false }) => {
  const busy = disabled || isExecuting || isSubmitting;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <LanguageSelector language={language} onChange={onLanguageChange} disabled={busy} />
        <ResetEditorButton onClick={onReset} disabled={busy} />
      </div>
      <div className="flex items-center gap-2">
        <RunCodeButton onClick={onRunCode} isLoading={isExecuting} disabled={busy} />
        <SubmitSolutionButton onClick={onSubmit} isLoading={isSubmitting} disabled={busy} />
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';
export default EditorToolbar;
