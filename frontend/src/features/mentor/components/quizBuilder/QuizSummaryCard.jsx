/**
 * QuizSummaryCard — Displays a live updating summary of the quiz parameters and questions.
 */
import { Check } from 'lucide-react';

export default function QuizSummaryCard({ summary, onSave, onCancel, saving }) {
  return (
    <div style={{
      padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF', position: 'sticky', top: '90px',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
        Quiz Summary
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Quiz Name</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{summary.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Total Questions</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{summary.questionCount}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Estimated Duration</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{summary.duration} mins</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Passing Criteria</span>
          <span style={{ color: '#111827', fontWeight: 500 }}>{summary.passingPercentage}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Negative Marking</span>
          <span style={{ color: summary.negativeMarking ? '#EF4444' : '#6B7280', fontWeight: 500 }}>
            {summary.negativeMarking ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#6B7280' }}>Answer Reveal</span>
          <span style={{ color: '#111827', fontWeight: 500, textTransform: 'capitalize' }}>
            {summary.answerReveal.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onSave}
          disabled={saving || summary.questionCount === 0 || !summary.name}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
            backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '14px',
            fontWeight: 600, cursor: (saving || summary.questionCount === 0 || !summary.name) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
            opacity: (saving || summary.questionCount === 0 || !summary.name) ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
          onMouseEnter={e => { if (!saving && summary.questionCount > 0 && summary.name) e.target.style.backgroundColor = '#1D4ED8'; }}
          onMouseLeave={e => { e.target.style.backgroundColor = '#2563EB'; }}
        >
          {saving ? 'Saving...' : 'Save Assessment'}
        </button>
        <button
          onClick={onCancel}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={e => e.target.style.backgroundColor = '#FFFFFF'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
