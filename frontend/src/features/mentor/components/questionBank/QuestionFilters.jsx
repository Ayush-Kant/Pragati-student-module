/**
 * QuestionFilters — Filter buttons for question type, difficulty, tags, sort, and reset
 */
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, RotateCcw } from 'lucide-react';

function FilterDropdown({ label, options, value, onChange, icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '8px',
          border: value ? '1px solid #2563EB' : '1px solid #E5E7EB',
          backgroundColor: value ? '#EFF6FF' : '#FFFFFF',
          color: value ? '#2563EB' : '#6B7280',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {value || label}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '6px',
          minWidth: '160px', maxHeight: '240px', overflowY: 'auto',
        }}>
          {value && (
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                width: '100%', padding: '8px 12px', border: 'none',
                background: 'none', color: '#EF4444', fontSize: '13px',
                cursor: 'pointer', borderRadius: '6px', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={13} /> Clear
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                border: 'none', textAlign: 'left',
                background: value === opt ? '#EFF6FF' : 'none',
                color: value === opt ? '#2563EB' : '#111827',
                fontSize: '13px', cursor: 'pointer', borderRadius: '6px',
                fontWeight: value === opt ? 600 : 400,
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
              onMouseLeave={e => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TYPES = ['MCQ', 'Multiple Select', 'True/False', 'Short Answer', 'Long Answer', 'Coding'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const SORTS = [
  { label: 'Sort: Newest', value: 'newest' },
  { label: 'Sort: Oldest', value: 'oldest' },
  { label: 'Sort: A-Z', value: 'a-z' },
  { label: 'Sort: Z-A', value: 'z-a' },
];

export default function QuestionFilters({ filters, onUpdateFilter, onReset, tags = [] }) {
  const sortLabel = SORTS.find(s => s.value === filters.sort)?.label || 'Sort: Newest';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    }}>
      <FilterDropdown
        label="Question Type"
        options={TYPES}
        value={filters.type}
        onChange={v => onUpdateFilter('type', v)}
      />
      <FilterDropdown
        label="Difficulty"
        options={DIFFICULTIES}
        value={filters.difficulty}
        onChange={v => onUpdateFilter('difficulty', v)}
      />
      <FilterDropdown
        label="Tags"
        options={tags}
        value={filters.tags[0] || ''}
        onChange={v => onUpdateFilter('tags', v ? [v] : [])}
      />
      <FilterDropdown
        label="Sort: Newest"
        options={SORTS.map(s => s.value)}
        value={filters.sort}
        onChange={v => onUpdateFilter('sort', v)}
      />
      <button
        onClick={onReset}
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '8px 12px', border: 'none', background: 'none',
          color: '#6B7280', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
        onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
      >
        <RotateCcw size={14} /> Reset Filters
      </button>
    </div>
  );
}
