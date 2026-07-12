/**
 * DifficultySelector — Visual difficulty picker (Easy / Medium / Hard)
 */
const DIFFICULTIES = [
  { value: 'Easy', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { value: 'Medium', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
  { value: 'Hard', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {DIFFICULTIES.map(diff => {
        const isActive = value === diff.value;
        return (
          <button
            key={diff.value}
            onClick={() => onChange(diff.value)}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: isActive ? `2px solid ${diff.color}` : '1px solid #E5E7EB',
              backgroundColor: isActive ? diff.bg : '#FFFFFF',
              color: isActive ? diff.color : '#6B7280',
              fontSize: '13px', fontWeight: isActive ? 600 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? diff.bg : '#FFFFFF'; }}
          >
            {diff.value}
          </button>
        );
      })}
    </div>
  );
}
