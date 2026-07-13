import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Award, Tag, Edit, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { questionBankService } from '../services/questionBankService';

const difficultyColors = {
  Easy: { bg: '#ECFDF5', color: '#10B981' },
  Medium: { bg: '#FFF7ED', color: '#F97316' },
  Hard: { bg: '#FEF2F2', color: '#EF4444' },
};

const typeColors = {
  MCQ: { bg: '#EFF6FF', color: '#2563EB' },
  'Multiple Select': { bg: '#F5F3FF', color: '#8B5CF6' },
  'True/False': { bg: '#ECFDF5', color: '#10B981' },
  'Short Answer': { bg: '#FFF7ED', color: '#F97316' },
  'Long Answer': { bg: '#FEF2F2', color: '#EF4444' },
  Coding: { bg: '#F0F9FF', color: '#0EA5E9' },
};

export default function QuestionPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestion() {
      try {
        setLoading(true);
        const data = await questionBankService.getQuestionById(id);
        if (data) setQuestion(data);
        else {
          toast.error('Question not found');
          navigate('/mentor/question-bank');
        }
      } catch (err) {
        toast.error('Failed to load question');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadQuestion();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/mentor/question-bank/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionBankService.deleteQuestion(id);
        toast.success('Question deleted successfully');
        navigate('/mentor/question-bank');
      } catch (err) {
        toast.error('Failed to delete question');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '14px', color: '#6B7280' }}>
        Loading question details...
      </div>
    );
  }

  const diff = difficultyColors[question.difficulty] || difficultyColors.Medium;
  const typeClr = typeColors[question.type] || typeColors.MCQ;

  const sectionStyle = {
    padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF', marginBottom: '20px',
  };

  const titleStyle = { fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/mentor/question-bank')}
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
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Question Preview
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
              View and verify the question format and structure.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
              color: '#F97316', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FFF7ED'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #FECACA', backgroundColor: '#FEF2F2',
              color: '#EF4444', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px',
        padding: '16px 20px', borderRadius: '12px', border: '1px solid #E5E7EB',
        backgroundColor: '#F8FAFC',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #E5E7EB' }}>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Type:</span>
          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: typeClr.bg, color: typeClr.color }}>
            {question.type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #E5E7EB' }}>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Difficulty:</span>
          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: diff.bg, color: diff.color }}>
            {question.difficulty}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '16px', borderRight: '1px solid #E5E7EB', color: '#6B7280', fontSize: '13px' }}>
          <Clock size={14} /> {question.estimatedTime} seconds
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '13px' }}>
          <Award size={14} /> {question.marks} Point{question.marks > 1 ? 's' : ''}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={titleStyle}>Question Statement</h3>
        <p style={{ fontSize: '16px', color: '#111827', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
          {question.question}
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={titleStyle}>Answer Scheme</h3>

        {(question.type === 'MCQ' || question.type === 'Multiple Select') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options?.map((opt, idx) => (
              <div key={opt.id || idx} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '8px',
                border: opt.isCorrect ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
                backgroundColor: opt.isCorrect ? '#ECFDF5' : '#FFFFFF',
              }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  backgroundColor: opt.isCorrect ? '#10B981' : '#F1F5F9',
                  color: opt.isCorrect ? '#FFFFFF' : '#6B7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{ fontSize: '14px', color: '#111827', flex: 1, fontWeight: opt.isCorrect ? 500 : 400 }}>
                  {opt.text}
                </span>
                {opt.isCorrect && (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                    Correct Answer
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {question.type === 'True/False' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {['True', 'False'].map(opt => {
              const isCorrect = question.correctAnswer === opt;
              return (
                <div key={opt} style={{
                  flex: 1, padding: '14px', borderRadius: '10px', textAlign: 'center',
                  border: isCorrect ? '2px solid #10B981' : '1px solid #E5E7EB',
                  backgroundColor: isCorrect ? '#ECFDF5' : '#FFFFFF',
                  color: isCorrect ? '#10B981' : '#6B7280',
                  fontWeight: 600, fontSize: '15px',
                }}>
                  {opt} {isCorrect && '✓'}
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'Short Answer' && (
          <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #A7F3D0', backgroundColor: '#ECFDF5' }}>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, textTransform: 'uppercase' }}>Expected Answer</div>
            <div style={{ fontSize: '15px', color: '#047857', fontWeight: 600, marginTop: '4px' }}>{question.correctAnswer}</div>
          </div>
        )}

        {question.type === 'Long Answer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Model / Sample Answer</div>
              <div style={{ fontSize: '14px', color: '#111827', marginTop: '6px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {question.correctAnswer || 'No model answer provided.'}
              </div>
            </div>
            {question.longAnswerGuidelines && (
              <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Grading Guidelines</div>
                <div style={{ fontSize: '14px', color: '#111827', marginTop: '6px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {question.longAnswerGuidelines}
                </div>
              </div>
            )}
          </div>
        )}

        {question.type === 'Coding' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
              Language: <span style={{ fontWeight: 600, color: '#2563EB' }}>{question.codingData?.language || 'JavaScript'}</span>
            </div>
            {question.codingData?.starterCode && (
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Starter Code</div>
                <pre style={{
                  padding: '14px', borderRadius: '8px', backgroundColor: '#0F172A', color: '#F8FAFC',
                  fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', margin: 0,
                }}>{question.codingData.starterCode}</pre>
              </div>
            )}
            {question.codingData?.solutionCode && (
              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Expected Solution</div>
                <pre style={{
                  padding: '14px', borderRadius: '8px', backgroundColor: '#0F172A', color: '#34D399',
                  fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', margin: 0,
                }}>{question.codingData.solutionCode}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {question.explanation && (
        <div style={sectionStyle}>
          <h3 style={titleStyle}>Explanation / Solution Details</h3>
          <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
            {question.explanation}
          </p>
        </div>
      )}

      {question.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {question.tags.map(tag => (
            <span key={tag} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 12px', borderRadius: '8px',
              backgroundColor: '#EFF6FF', color: '#2563EB',
              fontSize: '13px', fontWeight: 500,
            }}>
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
