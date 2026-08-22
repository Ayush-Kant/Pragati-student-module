export const calculateScore = (questions = [], submittedAnswers = []) => {
  const totalQuestions = questions.length || submittedAnswers.length || 0;
  let score = 0;

  const questionMap = new Map(questions.map((question) => [question.id, question]));

  submittedAnswers.forEach((answer) => {
    const question = questionMap.get(answer.questionId);
    if (question && Number(answer.selectedOptionId) === Number(question.correctOptionId)) {
      score += 1;
    }
  });

  const percentage = totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0;

  return {
    score,
    totalQuestions,
    percentage,
  };
};

export const evaluateAnswers = (questions = [], storedAnswers = []) => {
  const totalQuestions = questions.length;
  const answerMap = new Map(storedAnswers.map((answer) => [Number(answer.questionId), Number(answer.selectedOptionId)]));

  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unanswered = 0;

  questions.forEach((question) => {
    const selected = answerMap.get(Number(question.id));
    if (selected === undefined || selected === null) {
      unanswered += 1;
    } else if (Number(question.correctOptionId) === Number(selected)) {
      correctAnswers += 1;
    } else {
      incorrectAnswers += 1;
    }
  });

  const score = correctAnswers;
  const percentage = totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0;

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    score,
    percentage,
  };
};

export default {
  calculateScore,
  evaluateAnswers,
};
