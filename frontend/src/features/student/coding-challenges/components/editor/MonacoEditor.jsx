import { memo, useCallback, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { EDITOR_THEME } from '../../constants/codingChallengeConstants';
import { getMonacoLanguage } from '../../utils/codingChallengeHelpers';
import LoadingSpinner from '../common/LoadingSpinner';

const MonacoEditor = memo(({ language, code, onChange, height = '100%' }) => {
  const monacoLang = getMonacoLanguage(language);
  const observerRef = useRef(null);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const handleMount = useCallback((editor, monaco) => {
    monaco.editor.defineTheme(EDITOR_THEME, {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280' },
        { token: 'keyword', foreground: '7c3aed' },
        { token: 'string', foreground: '047857' },
        { token: 'number', foreground: 'b45309' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#475569',
        'editorGutter.background': '#ffffff',
        'editor.lineHighlightBackground': '#f8fafc',
        'editor.selectionBackground': '#dbeafe',
        'editorCursor.foreground': '#2563eb',
        'editorIndentGuide.background': '#e2e8f0',
        'editorIndentGuide.activeBackground': '#cbd5e1',
      },
    });

    const resizeObserver = new ResizeObserver(() => editor.layout());
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
        smoothScrolling: true,
        contextmenu: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        parameterHints: { enabled: true },
        formatOnPaste: true,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
      }}
    />
  );
});

MonacoEditor.displayName = 'MonacoEditor';
export default MonacoEditor;
