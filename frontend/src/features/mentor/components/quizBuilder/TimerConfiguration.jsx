/**
 * TimerConfiguration — Quiz and per-question timer settings
 */
import { Clock } from 'lucide-react';

export default function TimerConfiguration({ config, onUpdate }) {
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{
      padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Clock size={18} color="#2563EB" />
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Timer Settings</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Quiz Duration (minutes)
          </label>
          <input
            type="number"
            value={config.quizDuration}
            onChange={e => onUpdate('quizDuration', parseInt(e.target.value) || 0)}
            min={1}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Per Question Timer (seconds, 0 = disabled)
          </label>
          <input
            type="number"
            value={config.perQuestionTimer}
            onChange={e => onUpdate('perQuestionTimer', parseInt(e.target.value) || 0)}
            min={0}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>
    </div>
  );
}
