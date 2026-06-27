import { Eye, EyeOff, Send } from 'lucide-react';

const OPTIONS = [
  { value: 'immediately', label: 'Immediately', desc: 'Show correct answers as student answers each question', icon: Eye, color: '#10B981' },
  { value: 'after_submission', label: 'After Submission', desc: 'Reveal answers only after quiz is submitted', icon: Send, color: '#2563EB' },
  { value: 'never', label: 'Never', desc: 'Do not reveal correct answers to students', icon: EyeOff, color: '#EF4444' },
];

export default function AnswerRevealSettings({ value, onChange }) {
  return (
    <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>Answer Reveal</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPTIONS.map(opt => {
          const isActive = value === opt.value;
          const Icon = opt.icon;
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)} style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '10px',
              border: isActive ? `2px solid ${opt.color}` : '1px solid #E5E7EB',
              backgroundColor: isActive ? `${opt.color}0A` : '#FFFFFF',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `${opt.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={opt.color} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{opt.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%',
                  border: isActive ? `2px solid ${opt.color}` : '2px solid #D1D5DB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isActive && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: opt.color }} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
