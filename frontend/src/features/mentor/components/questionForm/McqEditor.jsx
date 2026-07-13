/**
 * McqEditor — MCQ question editor with options and single correct answer
 */
import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import OptionInput from './OptionInput';

export default function McqEditor({ options = [], onChange }) {
  const [error, setError] = useState('');

  const handleTextChange = (index, text) => {
    const updated = options.map((opt, i) => i === index ? { ...opt, text } : opt);
    onChange(updated);
    setError('');
  };

  const handleCorrectChange = (index) => {
    const updated = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
    onChange(updated);
    setError('');
  };

  const addOption = () => {
    if (options.length >= 8) return;
    onChange([...options, { id: String.fromCharCode(97 + options.length), text: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    onChange(updated);
  };

  const hasCorrect = options.some(o => o.isCorrect);

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          OPTIONS
        </span>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Select correct answer</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, idx) => (
          <OptionInput
            key={idx}
            index={idx}
            text={opt.text}
            isCorrect={opt.isCorrect}
            onTextChange={(text) => handleTextChange(idx, text)}
            onCorrectChange={() => handleCorrectChange(idx)}
            onRemove={() => removeOption(idx)}
            showRemove={options.length > 2}
            isRadio={true}
          />
        ))}
      </div>
      {!hasCorrect && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginTop: '10px', color: '#EF4444', fontSize: '12px',
        }}>
          <AlertCircle size={14} /> Please select a correct answer
        </div>
      )}
      {options.length < 8 && (
        <button
          onClick={addOption}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginTop: '12px', padding: '8px 14px', borderRadius: '8px',
            border: '1px dashed #E5E7EB', backgroundColor: 'transparent',
            color: '#6B7280', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#6B7280'; }}
        >
          <Plus size={14} /> Add Option
        </button>
      )}
    </div>
  );
}
