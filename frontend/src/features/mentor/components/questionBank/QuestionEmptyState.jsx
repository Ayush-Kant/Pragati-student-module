import { FileQuestion, Plus } from 'lucide-react';

export default function QuestionEmptyState({ onAddQuestion, hasFilters = false }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px', textAlign: 'center',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <FileQuestion size={32} color="#2563EB" />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
        {hasFilters ? 'No questions found' : 'No questions yet'}
      </h3>
      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0', maxWidth: '400px' }}>
        {hasFilters
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'Get started by creating your first question. It will appear here in your question bank.'}
      </p>
      {!hasFilters && onAddQuestion && (
        <button
          onClick={onAddQuestion}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          <Plus size={16} /> Add Your First Question
        </button>
      )}
    </div>
  );
}
