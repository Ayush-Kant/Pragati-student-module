/**
 * PassingCriteria — Passing percentage, negative marking, shuffle settings
 */
export default function PassingCriteria({ config, onUpdate }) {
  const toggleStyle = (isOn) => ({
    width: '44px', height: '24px', borderRadius: '12px',
    border: 'none', cursor: 'pointer',
    backgroundColor: isOn ? '#2563EB' : '#D1D5DB',
    position: 'relative', transition: 'background-color 0.2s',
  });

  const dotStyle = (isOn) => ({
    width: '18px', height: '18px', borderRadius: '50%',
    backgroundColor: '#FFFFFF', position: 'absolute',
    top: '3px', left: isOn ? '23px' : '3px',
    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  });

  return (
    <div style={{
      padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>
        Passing Rules
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Passing Percentage
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={config.passingPercentage}
              onChange={e => onUpdate('passingPercentage', parseInt(e.target.value) || 0)}
              min={0}
              max={100}
              style={{
                width: '80px', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '14px', color: '#6B7280' }}>%</span>
          </div>
        </div>

        {[
          { key: 'negativeMarking', label: 'Negative Marking' },
          { key: 'shuffleQuestions', label: 'Shuffle Questions' },
          { key: 'shuffleOptions', label: 'Shuffle Options' },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>{label}</span>
            <button
              onClick={() => onUpdate(key, !config[key])}
              style={toggleStyle(config[key])}
            >
              <span style={dotStyle(config[key])} />
            </button>
          </div>
        ))}

        {config.negativeMarking && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
              Negative Mark Value (per wrong answer)
            </label>
            <input
              type="number"
              value={config.negativeMarkValue}
              onChange={e => onUpdate('negativeMarkValue', parseFloat(e.target.value) || 0)}
              step={0.25}
              min={0}
              style={{
                width: '120px', padding: '10px 14px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
