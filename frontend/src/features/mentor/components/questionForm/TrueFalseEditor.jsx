/**
 * TrueFalseEditor — True/False question editor
 */
export default function TrueFalseEditor({ value, onChange }) {
  return (
    <div>
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
        Correct Answer
      </span>
      <div style={{ display: 'flex', gap: '12px' }}>
        {['True', 'False'].map(opt => {
          const isActive = value === opt;
          const color = opt === 'True' ? '#10B981' : '#EF4444';
          const bg = opt === 'True' ? '#ECFDF5' : '#FEF2F2';
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                flex: 1, padding: '14px', borderRadius: '10px',
                border: isActive ? `2px solid ${color}` : '1px solid #E5E7EB',
                backgroundColor: isActive ? bg : '#FFFFFF',
                color: isActive ? color : '#6B7280',
                fontSize: '15px', fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? bg : '#FFFFFF'; }}
            >
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: isActive ? `2px solid ${color}` : '2px solid #D1D5DB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isActive && (
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: color,
                  }} />
                )}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
