/**
 * CodingQuestionEditor — Code-based question editor
 */
import { useState } from 'react';

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'TypeScript', 'Go', 'Ruby'];

export default function CodingQuestionEditor({ data = {}, onChange }) {
  const { language = 'JavaScript', starterCode = '', solutionCode = '', testCases = [] } = data;

  const update = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const addTestCase = () => {
    update('testCases', [...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const updateTestCase = (index, field, value) => {
    const updated = testCases.map((tc, i) => i === index ? { ...tc, [field]: value } : tc);
    update('testCases', updated);
  };

  const removeTestCase = (index) => {
    update('testCases', testCases.filter((_, i) => i !== index));
  };

  const codeAreaStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1px solid #E5E7EB', fontSize: '13px',
    fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
    color: '#111827', resize: 'vertical', outline: 'none',
    transition: 'border-color 0.2s', lineHeight: 1.6,
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Language Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Programming Language
        </label>
        <select
          value={language}
          onChange={e => update('language', e.target.value)}
          style={{
            padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
            outline: 'none', cursor: 'pointer', backgroundColor: '#FFFFFF',
            minWidth: '200px',
          }}
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Starter Code */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Starter Code <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(shown to students)</span>
        </label>
        <textarea
          value={starterCode}
          onChange={e => update('starterCode', e.target.value)}
          placeholder="// Write starter code here..."
          rows={6}
          style={codeAreaStyle}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      {/* Solution Code */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Solution Code
        </label>
        <textarea
          value={solutionCode}
          onChange={e => update('solutionCode', e.target.value)}
          placeholder="// Write the expected solution..."
          rows={6}
          style={codeAreaStyle}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      {/* Test Cases */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Test Cases</label>
          <button
            onClick={addTestCase}
            style={{
              padding: '6px 12px', borderRadius: '6px',
              border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
              color: '#2563EB', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EFF6FF'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            + Add Test Case
          </button>
        </div>
        {testCases.map((tc, idx) => (
          <div key={idx} style={{
            padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB',
            marginBottom: '10px', backgroundColor: '#F8FAFC',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Test Case {idx + 1}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={tc.isHidden}
                    onChange={e => updateTestCase(idx, 'isHidden', e.target.checked)}
                    style={{ accentColor: '#2563EB' }}
                  />
                  Hidden
                </label>
                <button
                  onClick={() => removeTestCase(idx)}
                  style={{
                    border: 'none', background: 'none', color: '#EF4444',
                    fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Input</label>
                <textarea
                  value={tc.input}
                  onChange={e => updateTestCase(idx, 'input', e.target.value)}
                  rows={2}
                  placeholder="Test input..."
                  style={{ ...codeAreaStyle, fontSize: '12px' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Expected Output</label>
                <textarea
                  value={tc.expectedOutput}
                  onChange={e => updateTestCase(idx, 'expectedOutput', e.target.value)}
                  rows={2}
                  placeholder="Expected output..."
                  style={{ ...codeAreaStyle, fontSize: '12px' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>
          </div>
        ))}
        {testCases.length === 0 && (
          <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>
            No test cases added yet. Click "Add Test Case" to begin.
          </p>
        )}
      </div>
    </div>
  );
}
