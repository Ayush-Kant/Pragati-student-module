/**
 * QuestionCard — Card view for a single question (alternative to table row)
 */
import { Eye, Edit2, Trash2, Clock } from 'lucide-react';

const difficultyColors = {
  Easy: { bg: '#ECFDF5', color: '#10B981', border: '#A7F3D0' },
  Medium: { bg: '#FFF7ED', color: '#F97316', border: '#FED7AA' },
  Hard: { bg: '#FEF2F2', color: '#EF4444', border: '#FECACA' },
};

const typeColors = {
  MCQ: { bg: '#EFF6FF', color: '#2563EB' },
  'Multiple Select': { bg: '#F5F3FF', color: '#8B5CF6' },
  'True/False': { bg: '#ECFDF5', color: '#10B981' },
  'Short Answer': { bg: '#FFF7ED', color: '#F97316' },
  'Long Answer': { bg: '#FEF2F2', color: '#EF4444' },
  Coding: { bg: '#F0F9FF', color: '#0EA5E9' },
};

export default function QuestionCard({ question, onView, onEdit, onDelete }) {
  const diff = difficultyColors[question.difficulty] || difficultyColors.Medium;
  const typeClr = typeColors[question.type] || typeColors.MCQ;

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB',
      padding: '18px 20px', transition: 'box-shadow 0.2s, transform 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
              backgroundColor: typeClr.bg, color: typeClr.color,
            }}>{question.type}</span>
            <span style={{
              padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
              backgroundColor: diff.bg, color: diff.color,
            }}>{question.difficulty}</span>
          </div>
          <p style={{ fontSize: '14px', color: '#111827', fontWeight: 500, margin: '0 0 10px 0', lineHeight: 1.5 }}>
            {question.question}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {question.tags?.map(tag => (
              <span key={tag} style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                backgroundColor: '#F1F5F9', color: '#6B7280', fontWeight: 500,
              }}>{tag}</span>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>
              <Clock size={12} /> {question.estimatedTime}s
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { icon: Eye, action: onView, color: '#2563EB', hoverBg: '#EFF6FF', label: 'View' },
            { icon: Edit2, action: onEdit, color: '#F97316', hoverBg: '#FFF7ED', label: 'Edit' },
            { icon: Trash2, action: onDelete, color: '#EF4444', hoverBg: '#FEF2F2', label: 'Delete' },
          ].map(({ icon: Icon, action, color, hoverBg, label }) => (
            <button
              key={label}
              onClick={() => action(question)}
              title={label}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: 'none', backgroundColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon size={15} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
