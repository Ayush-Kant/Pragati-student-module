/**
 * QuestionBulkActions — Shows bulk action bar when items are selected
 */
import { Trash2, Download, Tag } from 'lucide-react';

export default function QuestionBulkActions({ selectedCount, onDelete, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', borderRadius: '10px',
      backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
      marginBottom: '16px',
      animation: 'slideDown 0.2s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          backgroundColor: '#2563EB', color: '#FFFFFF',
          borderRadius: '6px', padding: '2px 10px',
          fontSize: '13px', fontWeight: 600,
        }}>
          {selectedCount}
        </span>
        <span style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
          question{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onDelete}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '8px',
            border: '1px solid #FECACA', backgroundColor: '#FEF2F2',
            color: '#EF4444', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
        >
          <Trash2 size={14} /> Delete Selected
        </button>
        <button
          onClick={onClearSelection}
          style={{
            padding: '8px 14px', borderRadius: '8px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            color: '#6B7280', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}
