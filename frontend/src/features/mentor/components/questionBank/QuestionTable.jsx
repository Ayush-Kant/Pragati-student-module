/**
 * QuestionTable — Table view for question bank with checkbox selection, badges, and actions
 */
import { Eye, Edit2, Trash2, Clock } from 'lucide-react';

const difficultyColors = {
  Easy: { bg: '#ECFDF5', color: '#10B981' },
  Medium: { bg: '#FFF7ED', color: '#F97316' },
  Hard: { bg: '#FEF2F2', color: '#EF4444' },
};

const typeColors = {
  MCQ: { bg: '#EFF6FF', color: '#2563EB' },
  'Multiple Select': { bg: '#F5F3FF', color: '#8B5CF6' },
  'True/False': { bg: '#ECFDF5', color: '#10B981' },
  'Short Answer': { bg: '#FFF7ED', color: '#F97316' },
  'Long Answer': { bg: '#FEF2F2', color: '#EF4444' },
  Coding: { bg: '#F0F9FF', color: '#0EA5E9' },
};

function LoadingSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 8 }).map((_, j) => (
            <td key={j} style={{ padding: '16px 12px' }}>
              <div style={{
                height: j === 1 ? '32px' : '16px',
                width: j === 1 ? '80%' : j === 0 ? '20px' : '70%',
                backgroundColor: '#F1F5F9',
                borderRadius: '6px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default function QuestionTable({
  questions, loading, selectedIds,
  onToggleSelect, onToggleSelectAll,
  onView, onEdit, onDelete,
}) {
  const allSelected = questions.length > 0 && selectedIds.length === questions.length;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (seconds) => {
    if (seconds >= 60) return `${Math.floor(seconds / 60)} min`;
    return `${seconds} sec`;
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #E5E7EB',
    whiteSpace: 'nowrap',
    backgroundColor: '#F8FAFC',
  };

  const tdStyle = {
    padding: '14px 12px',
    fontSize: '14px',
    color: '#111827',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle',
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '860px',
        }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: '40px', paddingLeft: '20px' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </th>
              <th style={thStyle}>Question</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Difficulty</th>
              <th style={thStyle}>Tags</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Created</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <tbody>
              {questions.map((q) => {
                const diff = difficultyColors[q.difficulty] || difficultyColors.Medium;
                const typeClr = typeColors[q.type] || typeColors.MCQ;
                const isSelected = selectedIds.includes(q.id);

                return (
                  <tr
                    key={q.id}
                    style={{
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  >
                    <td style={{ ...tdStyle, paddingLeft: '20px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(q.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563EB' }}
                      />
                    </td>
                    <td style={{ ...tdStyle, maxWidth: '320px' }}>
                      <span style={{
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', fontWeight: 500, lineHeight: 1.4,
                      }}>
                        {q.question}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: typeClr.bg, color: typeClr.color, whiteSpace: 'nowrap',
                      }}>
                        {q.type === 'Multiple Select' ? 'Multi' : q.type === 'Short Answer' ? 'Short' : q.type === 'Long Answer' ? 'Free Text' : q.type}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        backgroundColor: diff.bg, color: diff.color,
                      }}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: '200px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {q.tags?.slice(0, 2).map(tag => (
                          <span key={tag} style={{
                            padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                            backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}>{tag}</span>
                        ))}
                        {q.tags?.length > 2 && (
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>+{q.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#6B7280', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#9CA3AF" />
                        {formatTime(q.estimatedTime)}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#6B7280', fontSize: '13px' }}>
                      {formatDate(q.createdAt)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                        {[
                          { icon: Eye, action: () => onView(q), color: '#2563EB', hoverBg: '#EFF6FF', label: 'View' },
                          { icon: Edit2, action: () => onEdit(q), color: '#F97316', hoverBg: '#FFF7ED', label: 'Edit' },
                          { icon: Trash2, action: () => onDelete(q.id), color: '#EF4444', hoverBg: '#FEF2F2', label: 'Delete' },
                        ].map(({ icon: Icon, action, color, hoverBg, label }) => (
                          <button
                            key={label}
                            onClick={action}
                            title={label}
                            style={{
                              width: '30px', height: '30px', borderRadius: '6px',
                              border: 'none', backgroundColor: 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Icon size={14} color={color} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
