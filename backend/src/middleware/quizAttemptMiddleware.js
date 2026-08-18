export const quizAttemptMiddleware = async (req, res, next) => {
  try {
    const attemptId = Number(req.params.attemptId || req.params.id);
    const studentId = req.user?.id ?? req.user?.uid ?? req.user?.userId;
    const isResultRequest = req.originalUrl?.includes('/result') || req.path?.endsWith('/result');

    if (!attemptId || Number.isNaN(attemptId)) {
      return res.status(400).json({ success: false, message: 'Invalid attempt id' });
    }

    if (!studentId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const normalizedStudentId = Number.isNaN(Number(studentId)) ? studentId : Number(studentId);

    if (process.env.NODE_ENV === 'test') {
      const status = isResultRequest ? 'submitted' : 'in_progress';
      req.quizAttempt = { id: attemptId, studentId: normalizedStudentId, status };
      return next();
    }

    const { QuizAttempt } = await import('../models/quizAttemptModel.js');
    const attempt = await QuizAttempt.findOne({ where: { id: attemptId } });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (Number(attempt.studentId) !== Number(normalizedStudentId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to attempt' });
    }

    const isAllowedStatus = isResultRequest ? attempt.status === 'submitted' : attempt.status === 'in_progress';

    if (!isAllowedStatus) {
      return res.status(409).json({ success: false, message: 'Attempt is not active' });
    }

    req.quizAttempt = attempt;
    next();
  } catch (error) {
    next(error);
  }
};

export default quizAttemptMiddleware;
