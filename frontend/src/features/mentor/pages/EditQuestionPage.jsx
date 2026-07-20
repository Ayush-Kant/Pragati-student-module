import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import QuestionForm from '../components/questionForm/QuestionForm';
import { questionBankService } from '../services/questionBankService';

export default function EditQuestionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestion() {
      try {
        setLoading(true);
        const data = await questionBankService.getQuestionById(id);
        if (data) {
          setQuestion(data);
        } else {
          toast.error('Question not found');
          navigate('/mentor/question-bank');
        }
      } catch (err) {
        toast.error('Failed to load question');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadQuestion();
    }
  }, [id, navigate]);

  const handleSave = async (questionData) => {
    try {
      await questionBankService.updateQuestion(id, questionData);
      toast.success('Question updated successfully!');
      navigate('/mentor/question-bank');
    } catch (err) {
      toast.error(err.message || 'Failed to update question');
    }
  };

  const handleCancel = () => {
    navigate('/mentor/question-bank');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '200px', fontSize: '14px', color: '#6B7280'
      }}>
        Loading question details...
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <QuestionForm
        initialData={question}
        onSave={handleSave}
        onCancel={handleCancel}
        availableTags={[
          'Data Structures', 'Algorithms', 'JavaScript', 'React', 'Core Concepts',
          'CSS', 'HTML', 'Node.js', 'Python', 'SQL', 'OOP', 'Testing'
        ]}
      />
    </div>
  );
}
