/**
 * QuestionSearch — Search input for the question bank
 */
import { Search } from 'lucide-react';

export default function QuestionSearch({ value, onChange }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
      <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
      <input
        type="text"
        placeholder="Search questions..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px 10px 36px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          fontSize: '14px',
          color: '#111827',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
