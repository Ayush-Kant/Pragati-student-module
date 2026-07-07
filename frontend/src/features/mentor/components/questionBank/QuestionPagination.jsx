/**
 * QuestionPagination — Page navigation for question bank table
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuestionPagination({ page, totalPages, total, pageSize, onPageChange }) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startP = Math.max(1, page - Math.floor(maxVisible / 2));
    let endP = Math.min(totalPages, startP + maxVisible - 1);
    if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

    if (startP > 1) { pages.push(1); if (startP > 2) pages.push('...'); }
    for (let i = startP; i <= endP; i++) pages.push(i);
    if (endP < totalPages) { if (endP < totalPages - 1) pages.push('...'); pages.push(totalPages); }

    return pages;
  };

  if (total === 0) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderTop: '1px solid #F1F5F9',
      marginTop: '8px',
    }}>
      <span style={{ fontSize: '13px', color: '#6B7280' }}>
        Showing {start} to {end} of {total.toLocaleString()} questions
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page <= 1}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            opacity: page <= 1 ? 0.4 : 1,
            transition: 'all 0.15s',
          }}
        >
          <ChevronLeft size={16} color="#6B7280" />
        </button>
        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} style={{ padding: '0 6px', color: '#9CA3AF', fontSize: '13px' }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '32px', height: '32px', borderRadius: '8px',
                border: p === page ? 'none' : '1px solid #E5E7EB',
                backgroundColor: p === page ? '#2563EB' : '#FFFFFF',
                color: p === page ? '#FFFFFF' : '#111827',
                fontSize: '13px', fontWeight: p === page ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (p !== page) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={e => { if (p !== page) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            opacity: page >= totalPages ? 0.4 : 1,
            transition: 'all 0.15s',
          }}
        >
          <ChevronRight size={16} color="#6B7280" />
        </button>
      </div>
    </div>
  );
}
