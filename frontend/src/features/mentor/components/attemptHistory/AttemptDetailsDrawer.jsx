import { X, CheckCircle2, XCircle, Clock, Award, MessageSquare } from 'lucide-react';
import AttemptStatusBadge from './AttemptStatusBadge';

export default function AttemptDetailsDrawer({ isOpen, attempt, onClose }) {
  if (!isOpen || !attempt) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.3)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div onClick={onClose} style={{ flex: 1 }} />

      <div style={{
        width: '100%', maxWidth: '560px', height: '100%',
        backgroundColor: '#FFFFFF', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideLeft 0.3s ease-out',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px', borderBottom: '1px solid #F1F5F9',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Attempt Details
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
              Submission summary and questions review
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: 'none', backgroundColor: '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            <X size={18} color="#6B7280" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{
            padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB',
            backgroundColor: '#F8FAFC', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{attempt.studentName}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{attempt.studentEmail}</div>
              </div>
              <AttemptStatusBadge status={attempt.status} />
            </div>

            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '12px' }}>
              {attempt.quizName}
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
              paddingTop: '16px', borderTop: '1px solid #E5E7EB',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Score</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563EB', marginTop: '4px' }}>
                  {attempt.score}<span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>/{attempt.totalMarks}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Percentage</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
                  {attempt.percentage}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Time Taken</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#F97316', marginTop: '4px' }}>
                  {attempt.timeTaken}
                </div>
              </div>
            </div>
          </div>

          {attempt.feedback && (
            <div style={{
              display: 'flex', gap: '12px', padding: '16px', borderRadius: '12px',
              backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
              marginBottom: '24px',
            }}>
              <MessageSquare size={20} color="#2563EB" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E3A8A' }}>Feedback</div>
                <div style={{ fontSize: '13px', color: '#1E40AF', marginTop: '4px', lineHeight: 1.5 }}>
                  {attempt.feedback}
                </div>
              </div>
            </div>
          )}

          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
            Answer Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {attempt.answers?.map((ans, idx) => (
              <div key={ans.questionId || idx} style={{
                padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                    Q{idx + 1}. {ans.questionText}
                  </div>
                  {ans.isCorrect ? (
                    <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                  ) : (
                    <XCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#6B7280', minWidth: '100px' }}>Selected Answer:</span>
                    <span style={{ fontWeight: 500, color: ans.isCorrect ? '#10B981' : '#EF4444' }}>
                      {ans.selectedAnswer}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#6B7280', minWidth: '100px' }}>Correct Answer:</span>
                    <span style={{ fontWeight: 500, color: '#10B981' }}>{ans.correctAnswer}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', marginTop: '4px' }}>
                    <span style={{ color: '#6B7280', minWidth: '100px' }}>Marks Awarded:</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      {ans.isCorrect ? ans.marks : 0}/{ans.maxMarks}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: '20px 24px', borderTop: '1px solid #F1F5F9',
          display: 'flex', gap: '12px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px',
              border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
              color: '#6B7280', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
}
