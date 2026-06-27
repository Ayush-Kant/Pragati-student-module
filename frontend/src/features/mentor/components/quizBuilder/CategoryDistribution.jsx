/**
 * CategoryDistribution — Visual category/difficulty distribution configuration
 */
export default function CategoryDistribution({ distribution, onChange }) {
  const categories = Object.entries(distribution);

  const updateValue = (key, value) => {
    onChange({ ...distribution, [key]: Math.max(0, Math.min(100, parseInt(value) || 0)) });
  };

  const colors = {
    Easy: '#10B981',
    Medium: '#F97316',
    Hard: '#EF4444',
    Frontend: '#2563EB',
    Backend: '#8B5CF6',
    Database: '#0EA5E9',
    DevOps: '#F97316',
    General: '#6B7280',
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
        Distribution
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '13px', color: '#111827', fontWeight: 500, minWidth: '80px',
            }}>
              {key}
            </span>
            <div style={{ flex: 1, position: 'relative', height: '8px', borderRadius: '4px', backgroundColor: '#F1F5F9' }}>
              <div style={{
                height: '100%', borderRadius: '4px',
                backgroundColor: colors[key] || '#2563EB',
                width: `${value}%`, transition: 'width 0.3s',
              }} />
            </div>
            <input
              type="number"
              value={value}
              onChange={e => updateValue(key, e.target.value)}
              min={0}
              max={100}
              style={{
                width: '54px', padding: '4px 8px', borderRadius: '6px',
                border: '1px solid #E5E7EB', fontSize: '13px', color: '#111827',
                textAlign: 'center', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
