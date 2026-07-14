/**
 * AttemptHistoryTable — Table showing all student quiz attempts
 */
import AttemptStatusBadge from './AttemptStatusBadge';

export default function AttemptHistoryTable({ attempts, loading, onRowClick }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const thStyle = {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F8FAFC',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '16px',
    fontSize: '14px',
    color: '#111827',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle',
  };

  if (loading) {
    return (
      <div style={{
        background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB',
        overflow: 'hidden', padding: '24px'
      }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            display: 'flex', gap: '16px', padding: '16px 0',
            borderBottom: i === 4 ? 'none' : '1px solid #F1F5F9',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <div style={{ height: '20px', width: '25%', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
            <div style={{ height: '20px', width: '35%', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
            <div style={{ height: '20px', width: '10%', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
            <div style={{ height: '20px', width: '15%', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
            <div style={{ height: '20px', width: '15%', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div style={{
        background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB',
        padding: '48px 24px', textAlign: 'center', color: '#6B7280'
      }}>
        No attempts recorded yet.
      </div>
    );
  }

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
              <th style={thStyle}>Student</th>
              <th style={thStyle}>Quiz</th>
              <th style={thStyle}>Score</th>
              <th style={thStyle}>Percentage</th>
              <th style={thStyle}>Time Taken</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((att) => (
              <tr
                key={att.id}
                onClick={() => onRowClick && onRowClick(att.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <td style={tdStyle}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{att.studentName}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{att.studentEmail}</div>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 500 }}>{att.quizName}</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600 }}>{att.score}</span>
                  <span style={{ color: '#6B7280', fontSize: '13px' }}>/{att.totalMarks}</span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    fontWeight: 600,
                    color: att.percentage >= 60 ? '#10B981' : att.percentage >= 40 ? '#F97316' : '#EF4444'
                  }}>
                    {att.percentage}%
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#6B7280' }}>
                  {att.timeTaken}
                </td>
                <td style={tdStyle}>
                  <AttemptStatusBadge status={att.status} />
                </td>
                <td style={{ ...tdStyle, color: '#6B7280', fontSize: '13px' }}>
                  {formatDate(att.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
