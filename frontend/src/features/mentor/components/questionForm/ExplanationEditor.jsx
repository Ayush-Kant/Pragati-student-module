/**
 * ExplanationEditor — Rich text explanation field (simplified textarea)
 */
export default function ExplanationEditor({ value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
        Explanation <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional — shown after submission)</span>
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Provide a detailed explanation for this question..."
        rows={4}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: '8px',
          border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
          resize: 'vertical', outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s', boxSizing: 'border-box',
          lineHeight: 1.5,
        }}
        onFocus={e => e.target.style.borderColor = '#2563EB'}
        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
      />
    </div>
  );
}
