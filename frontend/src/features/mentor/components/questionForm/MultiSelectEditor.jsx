/**
 * MultiSelectEditor — Multiple select question editor (checkboxes, multiple correct)
 */
import { Plus, AlertCircle } from 'lucide-react';
import OptionInput from './OptionInput';

export default function MultiSelectEditor({ options = [], onChange }) {
  const handleTextChange = (index, text) => {
    const updated = options.map((opt, i) => i === index ? { ...opt, text } : opt);
    onChange(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = options.map((opt, i) => i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt);
    onChange(updated);
  };

  const addOption = () => {
    if (options.length >= 8) return;
    onChange([...options, { id: String.fromCharCode(97 + options.length), text: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== index));
  };

  const correctCount = options.filter(o => o.isCorrect).length;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          OPTIONS
        </span>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Select all correct answers</span>
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
            isRadio={false}
          />
        ))}
      </div>
      {correctCount === 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginTop: '10px', color: '#EF4444', fontSize: '12px',
        }}>
          <AlertCircle size={14} /> Please select at least one correct answer
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
