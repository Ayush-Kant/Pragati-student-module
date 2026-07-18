import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, BookOpen, Shuffle } from 'lucide-react';
import useQuizBuilder from '../hooks/useQuizBuilder';
import { questionBankService } from '../services/questionBankService';
import QuizConfigurationCard from '../components/quizBuilder/QuizConfigurationCard';
import RandomQuestionSelector from '../components/quizBuilder/RandomQuestionSelector';
import CategoryDistribution from '../components/quizBuilder/CategoryDistribution';
import TimerConfiguration from '../components/quizBuilder/TimerConfiguration';
import PassingCriteria from '../components/quizBuilder/PassingCriteria';
import AnswerRevealSettings from '../components/quizBuilder/AnswerRevealSettings';
import QuizSummaryCard from '../components/quizBuilder/QuizSummaryCard';

export default function QuizBuilderPage() {
  const navigate = useNavigate();
  const {
    config, generatedQuestions, loading, error, summary,
    updateConfig, updateMultiple, resetConfig,
    generateRandomQuestions, saveQuiz
  } = useQuizBuilder();

  const [questionsList, setQuestionsList] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await questionBankService.getQuestions({ pageSize: 100 });
        setQuestionsList(res.data);
      } catch (err) {
        toast.error('Failed to load questions from bank');
      }
    }
    loadQuestions();
  }, []);

  const handleManualSelectToggle = (id) => {
    const current = config.selectedQuestionIds || [];
    const updated = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];
    updateConfig('selectedQuestionIds', updated);
  };

  const handleSave = async () => {
    if (!config.name) {
      toast.error('Please select an assessment name');
      return;
    }
    if (config.selectionMode === 'manual' && config.selectedQuestionIds.length === 0) {
      toast.error('Please select at least one question');
      return;
    }
    if (config.selectionMode === 'random' && generatedQuestions.length === 0) {
      toast.error('Please generate questions first');
      return;
    }

    setSaving(true);
    try {
      await saveQuiz();
      toast.success('Assessment generated successfully!');
      navigate('/mentor/question-bank');
    } catch (err) {
      toast.error(err.message || 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateRandom = async () => {
    const q = await generateRandomQuestions();
    if (q.length > 0) {
      toast.success(`Successfully generated ${q.length} questions!`);
    } else {
      toast.error('No questions matched the criteria.');
    }
  };

  const modeBtnStyle = (active) => ({
    flex: 1, padding: '14px', borderRadius: '10px',
    border: active ? '2px solid #2563EB' : '1px solid #E5E7EB',
    backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
    color: active ? '#2563EB' : '#6B7280',
    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
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
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Generate Quiz
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '2px 0 0 0' }}>
            Automatically create quizzes from your reusable question bank.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <QuizConfigurationCard config={config} onUpdate={updateConfig} />

          <div style={{
            padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
              Question Selection
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => updateConfig('selectionMode', 'manual')}
                style={modeBtnStyle(config.selectionMode === 'manual')}
              >
                <BookOpen size={16} /> Manual Selection
              </button>
              <button
                onClick={() => updateConfig('selectionMode', 'random')}
                style={modeBtnStyle(config.selectionMode === 'random')}
              >
                <Shuffle size={16} /> Random Selection
              </button>
            </div>

            {config.selectionMode === 'random' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <RandomQuestionSelector config={config} onUpdate={updateConfig} />
                <CategoryDistribution
                  distribution={config.difficultyDistribution}
                  onChange={dist => updateConfig('difficultyDistribution', dist)}
                />
                <button
                  onClick={handleGenerateRandom}
                  disabled={loading}
                  style={{
                    padding: '12px', borderRadius: '8px', border: 'none',
                    backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '14px',
                    fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
                >
                  {loading ? 'Generating...' : '⚡ Generate Quiz Questions'}
                </button>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
                  Select Questions from Bank ({config.selectedQuestionIds.length} selected)
                </label>
                <div style={{
                  maxHeight: '400px', overflowY: 'auto', border: '1px solid #E5E7EB',
                  borderRadius: '8px', display: 'flex', flexDirection: 'column',
                }}>
                  {questionsList.map(q => {
                    const isSelected = config.selectedQuestionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleManualSelectToggle(q.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 16px', borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer', backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          style={{ accentColor: '#2563EB' }}
                        />
                        <div style={{ flex: 1, fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                          {q.question}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                          {q.difficulty}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <TimerConfiguration config={config} onUpdate={updateConfig} />

          <PassingCriteria config={config} onUpdate={updateConfig} />

          <AnswerRevealSettings value={config.answerReveal} onChange={v => updateConfig('answerReveal', v)} />
        </div>

        <div>
          <QuizSummaryCard
            summary={summary}
            onSave={handleSave}
            onCancel={() => navigate('/mentor/question-bank')}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}
