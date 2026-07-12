/**
 * ShortAnswerEditor — Short answer question editor
 */
export default function ShortAnswerEditor({ value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
        Expected Answer
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter the expected short answer..."
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '8px',
          border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
          outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#2563EB'}
        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
      />
      <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
        The student's answer will be compared against this expected answer.
      </p>
    </div>
  );
}
