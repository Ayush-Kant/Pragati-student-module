import { RESULT_STATUS } from "../constants/assessmentConstants.js";

export const successResponse = (res, statusCode = 200, message = "", data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (res, statusCode = 500, message = "", errors = null) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

/**
 * Compares the student's selected option index against the question's
 * correctOption index. Options are stored as a JSONB array on the
 * question; correctOption is the index of the right answer in that array.
 */
export const evaluateAnswer = (question, selectedOption) => {
  const isCorrect =
    selectedOption !== null &&
    selectedOption !== undefined &&
    selectedOption === question.correctOption;

  return {
    isCorrect,
    marksAwarded: isCorrect ? question.marks : 0,
  };
};

export const buildResultSummary = ({ questions, evaluatedAnswers, passPercentage }) => {
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const marksObtained = evaluatedAnswers.reduce((sum, a) => sum + a.marksAwarded, 0);
  const correctCount = evaluatedAnswers.filter((a) => a.isCorrect).length;
  const answeredQuestionIds = new Set(evaluatedAnswers.map((a) => a.questionId));
  const unansweredCount = questions.length - answeredQuestionIds.size;
  const incorrectCount = evaluatedAnswers.length - correctCount;

  const percentage = totalMarks > 0 ? Number(((marksObtained / totalMarks) * 100).toFixed(2)) : 0;
  const status = percentage >= passPercentage ? RESULT_STATUS.PASSED : RESULT_STATUS.FAILED;

  return { totalMarks, marksObtained, percentage, correctCount, incorrectCount, unansweredCount, status };
};

/**
 * Strips correctOption from every question before sending to a student,
 * so answers aren't leaked while they're taking the assessment.
 */
export const sanitizeQuestionsForStudent = (questions) => {
  return questions.map((q) => {
    const plain = typeof q.toJSON === "function" ? q.toJSON() : q;
    const { correctOption, ...rest } = plain;
    return rest;
  });
};