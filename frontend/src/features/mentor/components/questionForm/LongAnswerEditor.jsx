/**
 * LongAnswerEditor — Long answer / essay question editor
 */
export default function LongAnswerEditor({ value, onChange, guidelines, onGuidelinesChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Model Answer
        </label>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Provide a model answer for this question..."
          rows={5}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '8px',
            border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
            resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.2s', lineHeight: 1.5, boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Grading Guidelines <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          value={guidelines || ''}
          onChange={e => onGuidelinesChange && onGuidelinesChange(e.target.value)}
          placeholder="Describe the key points to look for when grading..."
          rows={3}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '8px',
            border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
            resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.2s', lineHeight: 1.5, boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>
    </div>
  );
}
