/**
 * OptionInput — Reusable option input row with label badge, text, and correct answer selector
 */
import { X, GripVertical } from 'lucide-react';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const LABEL_COLORS = [
  '#2563EB', '#10B981', '#F97316', '#8B5CF6', '#EF4444', '#0EA5E9', '#D946EF', '#64748B'
];

export default function OptionInput({
  index, text, isCorrect, onTextChange, onCorrectChange, onRemove,
  showRemove = true, isRadio = true,
}) {
  const label = LABELS[index] || String(index + 1);
  const color = LABEL_COLORS[index % LABEL_COLORS.length];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '4px 0',
    }}>
      <span style={{
        width: '28px', height: '28px', borderRadius: '6px',
        backgroundColor: `${color}15`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, flexShrink: 0,
      }}>
        {label}
      </span>
      <input
        type="text"
        value={text}
        onChange={e => onTextChange(e.target.value)}
        placeholder="Add option text"
        style={{
          flex: 1, padding: '10px 14px', borderRadius: '8px',
          border: '1px solid #E5E7EB', fontSize: '14px',
          color: '#111827', outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#2563EB'}
        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
      />
      <input
        type={isRadio ? 'radio' : 'checkbox'}
        checked={isCorrect}
        onChange={() => onCorrectChange()}
        name={isRadio ? 'correct-answer' : undefined}
        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB', flexShrink: 0 }}
        title="Mark as correct answer"
      />
      {showRemove && (
        <button
          onClick={onRemove}
          style={{
            width: '28px', height: '28px', borderRadius: '6px',
            border: 'none', backgroundColor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background-color 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={14} color="#EF4444" />
        </button>
      )}
    </div>
  );
}
