import { calculateScore, evaluateAnswers } from './quizScoring.js';

export { calculateScore, evaluateAnswers };

export const sanitizeQuizOption = (option = {}) => ({
  id: option.id,
  optionText: option.optionText,
  displayOrder: option.displayOrder,
});

export const sanitizeQuizQuestion = (question = {}) => ({
  id: question.id,
  questionText: question.questionText,
  displayOrder: question.displayOrder,
  options: (question.options || []).map(sanitizeQuizOption),
});

export default {
  calculateScore,
  evaluateAnswers,
  sanitizeQuizOption,
  sanitizeQuizQuestion,
};
