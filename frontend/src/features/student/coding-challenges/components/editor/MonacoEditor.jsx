import { memo, useCallback, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { EDITOR_THEME } from '../../constants/codingChallengeConstants';
import { getMonacoLanguage } from '../../utils/codingChallengeHelpers';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Monaco editor wrapper with custom dark theme, auto-layout, and loading state.
 *
 * Fix (Issue 1): `EDITOR_THEME` is now `'pragati-dark'` so the `theme` prop and
 * the `defineTheme` call use the same value — no redundant `setTheme` call.
 *
 * Fix (Issue 2): ResizeObserver is stored in a ref and cleaned up via `useEffect`
 * instead of relying on the `onMount` return value, which `@monaco-editor/react`
 * does not treat as a cleanup function.
 *
 * @param {{
 *   language: string,
 *   code: string,
 *   onChange: Function,
 *   height?: string,
 * }} props
 */
const MonacoEditor = memo(({ language, code, onChange, height = '100%' }) => {
  const monacoLang = getMonacoLanguage(language);
  const observerRef = useRef(null);

  // Clean up the ResizeObserver when this component unmounts (Issue 2 fix).
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleMount = useCallback((editor, monaco) => {
    // Define and apply the custom dark theme matching the app's #080808 background.
    // Issue 1 fix: theme name matches EDITOR_THEME constant — no separate setTheme call needed.
    monaco.editor.defineTheme(EDITOR_THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#080808',
        'editor.lineHighlightBackground': '#111111',
        'editorGutter.background': '#080808',
        'editor.selectionBackground': '#f9731630',
      },
    });
    // Note: the Editor component applies EDITOR_THEME via its `theme` prop after mount.
    // We do NOT call setTheme here to avoid double-applying.

    // Issue 2 fix: store observer in ref so the useEffect above can disconnect it.
    const resizeObserver = new ResizeObserver(() => {
      editor.layout();
    });
    resizeObserver.observe(editor.getContainerDomNode());
    observerRef.current = resizeObserver;
  }, []);

  return (
    <Editor
      height={height}
      language={monacoLang}
      value={code}
      theme={EDITOR_THEME}
      onChange={(value) => onChange(value ?? '')}
      onMount={handleMount}
      loading={<LoadingSpinner size="md" label="Loading editor…" />}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        wordWrap: 'off',
        tabSize: 2,
        insertSpaces: true,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        contextmenu: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        parameterHints: { enabled: true },
        formatOnType: false,
        formatOnPaste: true,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
});

MonacoEditor.displayName = 'MonacoEditor';

export default MonacoEditor;
