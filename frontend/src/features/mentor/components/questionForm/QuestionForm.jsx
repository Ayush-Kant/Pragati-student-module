import { useState, useEffect } from 'react';
import { X, Save, Send, ArrowLeft } from 'lucide-react';
import McqEditor from './McqEditor';
import MultiSelectEditor from './MultiSelectEditor';
import TrueFalseEditor from './TrueFalseEditor';
import ShortAnswerEditor from './ShortAnswerEditor';
import LongAnswerEditor from './LongAnswerEditor';
import CodingQuestionEditor from './CodingQuestionEditor';
import TagSelector from './TagSelector';
import DifficultySelector from './DifficultySelector';
import ExplanationEditor from './ExplanationEditor';

const QUESTION_TYPES = [
  { value: 'MCQ', label: 'Multiple Choice (MCQ)' },
  { value: 'Multiple Select', label: 'Multiple Select' },
  { value: 'True/False', label: 'True / False' },
  { value: 'Short Answer', label: 'Short Answer' },
  { value: 'Long Answer', label: 'Long Answer' },
  { value: 'Coding', label: 'Coding Question' },
];

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'General'];

const defaultOptions = [
  { id: 'a', text: '', isCorrect: false },
  { id: 'b', text: '', isCorrect: false },
  { id: 'c', text: '', isCorrect: false },
];

const defaultFormData = {
  title: '',
  question: '',
  type: 'MCQ',
  category: 'General',
  difficulty: 'Medium',
  tags: [],
  marks: 1,
  estimatedTime: 60,
  options: [...defaultOptions],
  correctAnswer: '',
  explanation: '',
  codingData: {},
  longAnswerGuidelines: '',
  status: 'draft',
};

export default function QuestionForm({
  initialData = null,
  availableTags = [],
  onSave,
  onCancel,
  isModal = false,
}) {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
        options: initialData.options?.length > 0 ? initialData.options : [...defaultOptions],
      });
    }
  }, [initialData]);

  const update = (key, value) => {
    setFormData(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'type') {
        if (value === 'MCQ' || value === 'Multiple Select') {
          next.options = prev.options?.length > 0 ? prev.options.map(o => ({ ...o, isCorrect: false })) : [...defaultOptions];
        }
        next.correctAnswer = '';
        next.codingData = {};
      }
      return next;
    });
  };

  const handleSave = async (status) => {
    setSaving(true);
    try {
      await onSave({ ...formData, status });
    } finally {
      setSaving(false);
    }
  };

  const renderTypeEditor = () => {
    switch (formData.type) {
      case 'MCQ':
        return <McqEditor options={formData.options} onChange={opts => update('options', opts)} />;
      case 'Multiple Select':
        return <MultiSelectEditor options={formData.options} onChange={opts => update('options', opts)} />;
      case 'True/False':
        return <TrueFalseEditor value={formData.correctAnswer} onChange={v => update('correctAnswer', v)} />;
      case 'Short Answer':
        return <ShortAnswerEditor value={formData.correctAnswer} onChange={v => update('correctAnswer', v)} />;
      case 'Long Answer':
        return (
          <LongAnswerEditor
            value={formData.correctAnswer}
            onChange={v => update('correctAnswer', v)}
            guidelines={formData.longAnswerGuidelines}
            onGuidelinesChange={v => update('longAnswerGuidelines', v)}
          />
        );
      case 'Coding':
        return <CodingQuestionEditor data={formData.codingData} onChange={v => update('codingData', v)} />;
      default:
        return null;
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' };

  const sectionStyle = {
    padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF', marginBottom: '20px',
  };

  if (isModal) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '16px',
          width: '100%', maxWidth: '640px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid #E5E7EB',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {initialData ? 'Edit Question' : 'Create Question'}
            </h2>
            <button
              onClick={onCancel}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: 'none', backgroundColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} color="#6B7280" />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {/* Type & Difficulty Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Question Type</label>
                <select
                  value={formData.type}
                  onChange={e => update('type', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                >
                  {QUESTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={e => update('difficulty', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                >
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Question Text <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={e => update('question', e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                style={{
                  ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
                }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              {renderTypeEditor()}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Time Limit</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={e => update('estimatedTime', parseInt(e.target.value) || 0)}
                    min={0}
                    style={{ ...inputStyle, width: '100px' }}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>seconds</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tags</label>
                <TagSelector tags={formData.tags} availableTags={availableTags} onChange={t => update('tags', t)} />
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
            padding: '16px 24px', borderTop: '1px solid #E5E7EB',
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px', borderRadius: '8px',
                border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
                color: '#6B7280', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving || !formData.question.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '8px',
                border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                transition: 'background-color 0.15s',
                opacity: saving || !formData.question.trim() ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px',
      }}>
        <button
          onClick={onCancel}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <ArrowLeft size={18} color="#6B7280" />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {initialData ? 'Edit Question' : 'Create Question'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '2px 0 0 0' }}>
            {initialData ? 'Update the question details below.' : 'Fill in the details to create a new question.'}
          </p>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>
          Basic Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Question Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => update('title', e.target.value)}
              placeholder="A brief title for this question"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Question Statement <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={e => update('question', e.target.value)}
              placeholder="Enter your question here..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={e => update('category', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tags</label>
              <TagSelector tags={formData.tags} availableTags={availableTags} onChange={t => update('tags', t)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Difficulty</label>
              <DifficultySelector value={formData.difficulty} onChange={v => update('difficulty', v)} />
            </div>
            <div>
              <label style={labelStyle}>Marks</label>
              <input
                type="number"
                value={formData.marks}
                onChange={e => update('marks', parseInt(e.target.value) || 0)}
                min={0}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div>
              <label style={labelStyle}>Estimated Time (sec)</label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={e => update('estimatedTime', parseInt(e.target.value) || 0)}
                min={0}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
          Question Type
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '24px' }}>
          {QUESTION_TYPES.map(t => {
            const isActive = formData.type === t.value;
            return (
              <button
                key={t.value}
                onClick={() => update('type', t.value)}
                style={{
                  padding: '12px 14px', borderRadius: '10px',
                  border: isActive ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#2563EB' : '#6B7280',
                  fontSize: '13px', fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? '#EFF6FF' : '#FFFFFF'; }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {renderTypeEditor()}
      </div>

      <div style={sectionStyle}>
        <ExplanationEditor value={formData.explanation} onChange={v => update('explanation', v)} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
        padding: '20px 0',
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px', borderRadius: '10px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            color: '#6B7280', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave('draft')}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '10px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            color: '#111827', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <Save size={15} /> Save Draft
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={saving || !formData.question.trim()}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '10px',
            border: 'none', backgroundColor: '#2563EB', color: '#FFFFFF',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'background-color 0.15s',
            opacity: saving || !formData.question.trim() ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
        >
          <Send size={15} /> Publish Question
        </button>
      </div>
    </div>
  );
}
