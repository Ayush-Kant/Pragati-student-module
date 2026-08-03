import { HTTP_STATUS, RESULT_STATUS } from "../constants/assessmentConstants.js";

/**
 * Standardized success response.
 */
export const successResponse = (res, statusCode = HTTP_STATUS.OK, message = "", data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized error response.
 */
export const errorResponse = (
  res,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message = "",
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Compares a student's selected option ids against the correct option ids
 * for a question and determines correctness + marks awarded.
 * Multiple-choice questions require an exact set match to be marked correct.
 */
export const evaluateAnswer = (question, selectedOptionIds = []) => {
  const correctOptionIds = (question.options || [])
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.id)
    .sort();

  const selectedSorted = [...(selectedOptionIds || [])].sort();

  const isCorrect =
    correctOptionIds.length === selectedSorted.length &&
    correctOptionIds.every((id, idx) => id === selectedSorted[idx]);

  return {
    isCorrect,
    marksAwarded: isCorrect ? question.marks : 0,
  };
};

/**
 * Aggregates evaluated answers into a final result summary.
 */
export const buildResultSummary = ({ questions, evaluatedAnswers, passPercentage }) => {
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const marksObtained = evaluatedAnswers.reduce((sum, a) => sum + a.marksAwarded, 0);
  const correctCount = evaluatedAnswers.filter((a) => a.isCorrect).length;
  const answeredQuestionIds = new Set(evaluatedAnswers.map((a) => a.questionId));
  const unansweredCount = questions.length - answeredQuestionIds.size;
  const incorrectCount = evaluatedAnswers.length - correctCount;

  const percentage = totalMarks > 0 ? Number(((marksObtained / totalMarks) * 100).toFixed(2)) : 0;
  const status = percentage >= passPercentage ? RESULT_STATUS.PASSED : RESULT_STATUS.FAILED;

  return {
    totalMarks,
    marksObtained,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    status,
  };
};

/**
 * Strips the `isCorrect` flag from options before sending questions to
 * a student who is starting/taking an assessment, so answers aren't leaked.
 */
export const sanitizeQuestionsForStudent = (questions) => {
  return questions.map((q) => {
    const plain = typeof q.toJSON === "function" ? q.toJSON() : q;
    return {
      ...plain,
      options: (plain.options || []).map(({ isCorrect, ...rest }) => rest),
    };
  });
};
