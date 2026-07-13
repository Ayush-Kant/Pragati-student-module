import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import QuestionForm from '../components/questionForm/QuestionForm';
import { questionBankService } from '../services/questionBankService';

export default function CreateQuestionPage() {
  const navigate = useNavigate();

  const handleSave = async (questionData) => {
    try {
      await questionBankService.createQuestion(questionData);
      toast.success('Question created successfully!');
      navigate('/mentor/question-bank');
    } catch (err) {
      toast.error(err.message || 'Failed to create question');
    }
  };

  const handleCancel = () => {
    navigate('/mentor/question-bank');
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <QuestionForm
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
