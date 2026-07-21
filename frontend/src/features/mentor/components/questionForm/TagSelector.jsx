/**
 * TagSelector — Tag input with autocomplete and removable chips
 */
import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagSelector({ tags = [], availableTags = [], onChange }) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = availableTags.filter(t =>
    !tags.includes(t) && t.toLowerCase().includes(input.toLowerCase())
  );

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput('');
    setShowDropdown(false);
  };

  const removeTag = (tag) => {
    onChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF', minHeight: '42px',
        transition: 'border-color 0.2s',
      }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: '6px',
            backgroundColor: '#EFF6FF', color: '#2563EB',
            fontSize: '12px', fontWeight: 500,
          }}>
            {tag}
            <button
              onClick={() => removeTag(tag)}
              style={{
                border: 'none', background: 'none', padding: 0,
                cursor: 'pointer', display: 'flex',
              }}
            >
              <X size={12} color="#2563EB" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Add tags...' : ''}
          style={{
            border: 'none', outline: 'none', flex: 1, minWidth: '80px',
            fontSize: '13px', color: '#111827', backgroundColor: 'transparent',
          }}
        />
      </div>
      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          zIndex: 50, backgroundColor: '#FFFFFF', borderRadius: '10px',
          border: '1px solid #E5E7EB', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          padding: '6px', maxHeight: '200px', overflowY: 'auto',
        }}>
          {filtered.slice(0, 10).map(tag => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                border: 'none', textAlign: 'left', background: 'none',
                fontSize: '13px', color: '#111827', cursor: 'pointer',
                borderRadius: '6px',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
